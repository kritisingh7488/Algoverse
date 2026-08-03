const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

exports.executeCode = async (req, res) => {
  const { language, code, input } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileId = crypto.randomBytes(8).toString('hex');
  let filePath = '';
  let command = '';
  
  // Handle stdin
  let inputPath = '';
  let inputRedirect = '';
  if (input !== undefined && input !== null) {
    inputPath = path.join(tempDir, `main_${fileId}_in.txt`);
    fs.writeFileSync(inputPath, String(input));
    inputRedirect = ` < ${inputPath}`;
  }

  if (language === 'javascript') {
    filePath = path.join(tempDir, `main_${fileId}.js`);
    fs.writeFileSync(filePath, code);
    command = `node ${filePath}${inputRedirect}`;
  } else if (language === 'python') {
    filePath = path.join(tempDir, `main_${fileId}.py`);
    fs.writeFileSync(filePath, code);
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    command = `${pythonCmd} ${filePath}${inputRedirect}`;
  } else if (language === 'c++' || language === 'cpp') {
    filePath = path.join(tempDir, `main_${fileId}.cpp`);
    const outPath = process.platform === 'win32' 
      ? path.join(tempDir, `main_${fileId}.exe`) 
      : path.join(tempDir, `main_${fileId}.out`);
    fs.writeFileSync(filePath, code);
    command = `g++ ${filePath} -o ${outPath} && ${process.platform === 'win32' ? outPath : `./${path.basename(outPath)}`}${inputRedirect}`;
  } else {
    // For java, rust, go, just mock it or return error
    return res.status(400).json({ 
      run: { 
        code: 1, 
        stderr: `Cloud execution for ${language} is not supported on this server. Please use JavaScript, Python, or C++.` 
      } 
    });
  }

  // Execute with timeout
  exec(command, { timeout: 10000, cwd: tempDir }, (error, stdout, stderr) => {
    // Cleanup files
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (language === 'c++' || language === 'cpp') {
        const outPath = process.platform === 'win32' 
          ? path.join(tempDir, `main_${fileId}.exe`) 
          : path.join(tempDir, `main_${fileId}.out`);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      }
    } catch (e) {
      console.error("Cleanup error:", e);
    }

    if (error) {
      // If it was a compilation error or runtime error
      return res.json({
        run: {
          code: error.code || 1,
          stdout: stdout,
          stderr: error.killed ? 'Execution timed out (10s limit)' : (stderr || error.message)
        }
      });
    }

    res.json({
      run: {
        code: 0,
        stdout: stdout,
        stderr: stderr
      }
    });
  });
};
