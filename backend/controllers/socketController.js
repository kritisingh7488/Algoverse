const fs = require('fs');
const path = require('path');
let pty;
try {
  pty = require('node-pty');
} catch (e) {
  console.warn("node-pty module not found or failed to load. Will fallback to child_process.spawn.");
}
const crypto = require('crypto');
const os = require('os');

const isWindows = os.platform() === 'win32';
const tempDir = path.join(__dirname, '../temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    let ptyProcess = null;
    let filePaths = [];

    socket.on('run_code', ({ language, code }) => {
      // Clean up previous process if any
      if (ptyProcess) {
        ptyProcess.kill();
        ptyProcess = null;
      }

      const fileId = crypto.randomBytes(8).toString('hex');
      let shell = '';
      let args = [];

      try {
        if (language === 'javascript') {
          const jsPath = path.join(tempDir, `main_${fileId}.js`);
          fs.writeFileSync(jsPath, code);
          filePaths.push(jsPath);
          shell = isWindows ? 'node.exe' : 'node';
          args = [jsPath];
        } else if (language === 'python') {
          const pyPath = path.join(tempDir, `main_${fileId}.py`);
          fs.writeFileSync(pyPath, code);
          filePaths.push(pyPath);
          shell = isWindows ? 'python.exe' : 'python3';
          args = [pyPath];
        } else if (language === 'c++' || language === 'cpp') {
          const cppPath = path.join(tempDir, `main_${fileId}.cpp`);
          const outPath = isWindows ? path.join(tempDir, `main_${fileId}.exe`) : path.join(tempDir, `main_${fileId}.out`);
          fs.writeFileSync(cppPath, code);
          filePaths.push(cppPath);
          filePaths.push(outPath);
          
          socket.emit('terminal_data', '\x1b[33mCompiling...\x1b[0m\r\n');
          
          // Async compile so we don't block the Node event loop!
          const { exec } = require('child_process');
          exec(`g++ "${cppPath}" -o "${outPath}"`, (error, stdout, stderr) => {
            if (error) {
              socket.emit('terminal_data', '\x1b[31mCompilation Error:\x1b[0m\r\n' + stderr.replace(/\n/g, '\r\n'));
              socket.emit('process_exit', 1);
              return;
            }
            socket.emit('terminal_data', '\x1b[32mCompilation successful! Running...\x1b[0m\r\n');
            spawnPty(outPath, []);
          });
          return; // Return early, spawnPty is called inside the callback
        } else {
          socket.emit('terminal_data', '\x1b[31mLanguage not supported for interactive execution.\x1b[0m\r\n');
          socket.emit('process_exit', 1);
          return;
        }

        spawnPty(shell, args);

        function spawnPty(executable, spawnArgs) {
          try {
            if (!pty) throw new Error("node-pty not available");
            // Try to spawn PTY
            ptyProcess = pty.spawn(executable, spawnArgs, {
              name: 'xterm-color',
              cols: 80,
              rows: 24,
              cwd: tempDir,
              env: process.env
            });

            ptyProcess.onData((data) => {
              socket.emit('terminal_data', data);
            });

            ptyProcess.onExit(({ exitCode, signal }) => {
              ptyProcess = null;
              socket.emit('terminal_data', `\r\n\x1b[90m[Process exited with code ${exitCode}]\x1b[0m\r\n`);
              socket.emit('process_exit', exitCode);
              
              // Cleanup
              filePaths.forEach(p => {
                if (fs.existsSync(p)) {
                  try { fs.unlinkSync(p); } catch (e) {}
                }
              });
              filePaths = [];
            });
          } catch (ptyErr) {
            console.warn("node-pty failed, falling back to child_process.spawn:", ptyErr.message);
            // Fallback to standard spawn
            const { spawn } = require('child_process');
            
            // For python, use -u to force unbuffered output so it works without PTY
            if (executable === 'python' || executable === 'python3' || executable === 'python.exe') {
                spawnArgs.unshift('-u');
            }

            ptyProcess = spawn(executable, spawnArgs, {
              cwd: tempDir,
              env: process.env
            });
            
            // Add write method shim for socket input
            ptyProcess.write = (data) => {
                if (ptyProcess.stdin) ptyProcess.stdin.write(data);
                // Also echo locally since spawn doesn't echo like a PTY
                socket.emit('terminal_data', data); 
            };

            ptyProcess.stdout.on('data', (data) => {
              socket.emit('terminal_data', data.toString());
            });

            ptyProcess.stderr.on('data', (data) => {
              socket.emit('terminal_data', data.toString());
            });

            ptyProcess.on('close', (exitCode) => {
              ptyProcess = null;
              socket.emit('terminal_data', `\r\n\x1b[90m[Process exited with code ${exitCode}]\x1b[0m\r\n`);
              socket.emit('process_exit', exitCode);
              
              // Cleanup
              filePaths.forEach(p => {
                if (fs.existsSync(p)) {
                  try { fs.unlinkSync(p); } catch (e) {}
                }
              });
              filePaths = [];
            });
          }
        }

      } catch (err) {
        socket.emit('terminal_data', '\x1b[31mExecution Error:\x1b[0m\r\n' + err.message + '\r\n');
        socket.emit('process_exit', 1);
      }
    });

    socket.on('terminal_input', (data) => {
      if (ptyProcess) {
        ptyProcess.write(data);
      }
    });

    socket.on('kill_process', () => {
      if (ptyProcess) {
        ptyProcess.kill();
        socket.emit('terminal_data', '\r\n\x1b[31m[Process killed by user]\x1b[0m\r\n');
        ptyProcess = null;
      }
    });

    socket.on('disconnect', () => {
      if (ptyProcess) {
        ptyProcess.kill();
      }
      filePaths.forEach(p => {
        if (fs.existsSync(p)) {
          try { fs.unlinkSync(p); } catch (e) {}
        }
      });
      console.log('Socket disconnected:', socket.id);
    });
  });
};
