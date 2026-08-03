const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const cppDir = path.join(__dirname, '../cpp');

if (!fs.existsSync(cppDir)) {
  console.log('No cpp directory found at', cppDir);
  process.exit(0);
}

const files = fs.readdirSync(cppDir).filter(file => file.endsWith('.cpp'));
const ext = process.platform === 'win32' ? '.exe' : '.out';

console.log(`Compiling C++ engines for ${process.platform}...`);

files.forEach(file => {
  const sourcePath = path.join(cppDir, file);
  const outPath = path.join(cppDir, file.replace('.cpp', ext));
  console.log(`Compiling ${file}...`);
  try {
    execSync(`g++ "${sourcePath}" -o "${outPath}"`, { stdio: 'inherit' });
    console.log(`Successfully compiled ${file}`);
  } catch (error) {
    console.error(`Warning: Failed to compile ${file}. This is expected if g++ is not installed.`, error.message);
  }
});

console.log('Compilation finished.');
