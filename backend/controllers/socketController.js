const fs = require('fs');
const path = require('path');
const pty = require('node-pty');
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
          
          socket.emit('terminal_data', '\\x1b[33mCompiling...\\x1b[0m\\r\\n');
          
          // Sync compile for simplicity before attaching PTY to the actual binary
          const { execSync } = require('child_process');
          try {
            execSync(`g++ "${cppPath}" -o "${outPath}"`, { stdio: 'pipe' });
            socket.emit('terminal_data', '\\x1b[32mCompilation successful! Running...\\x1b[0m\\r\\n');
            shell = outPath;
            args = [];
          } catch (err) {
            socket.emit('terminal_data', '\\x1b[31mCompilation Error:\\x1b[0m\\r\\n' + err.stderr.toString().replace(/\\n/g, '\\r\\n'));
            socket.emit('process_exit', 1);
            return;
          }
        } else {
          socket.emit('terminal_data', '\\x1b[31mLanguage not supported for interactive execution.\\x1b[0m\\r\\n');
          socket.emit('process_exit', 1);
          return;
        }

        // Spawn PTY
        ptyProcess = pty.spawn(shell, args, {
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
          socket.emit('terminal_data', `\\r\\n\\x1b[90m[Process exited with code ${exitCode}]\\x1b[0m\\r\\n`);
          socket.emit('process_exit', exitCode);
          
          // Cleanup
          filePaths.forEach(p => {
            if (fs.existsSync(p)) {
              try { fs.unlinkSync(p); } catch (e) {}
            }
          });
          filePaths = [];
        });

      } catch (err) {
        socket.emit('terminal_data', '\\x1b[31mExecution Error:\\x1b[0m\\r\\n' + err.message + '\\r\\n');
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
        socket.emit('terminal_data', '\\r\\n\\x1b[31m[Process killed by user]\\x1b[0m\\r\\n');
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
