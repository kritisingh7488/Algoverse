const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const ext = process.platform === 'win32' ? '.exe' : '.out';
const CPP_BINARY_PATH = path.join(__dirname, `../cpp/string_engine${ext}`);

const runStringAlgorithm = async (req, res) => {
    try {
        const { algorithm = 'kmp', text = '', pattern = '' } = req.body;

        if (!text || !pattern) {
            return res.status(400).json({ success: false, message: 'Text and pattern must not be empty.' });
        }

        if (fs.existsSync(CPP_BINARY_PATH)) {
            const env = { ...process.env, PATH: `${process.env.PATH};C:\\msys64\\ucrt64\\bin` };
            
            const child = execFile(CPP_BINARY_PATH, [algorithm], { env }, (error, stdout, stderr) => {
                if (!error && stdout) {
                    try {
                        const parsed = JSON.parse(stdout);
                        if (parsed.success) {
                            return res.json(parsed);
                        }
                    } catch (e) {
                        console.error('Failed to parse C++ String Engine JSON output:', e);
                        console.error('Raw stdout:', stdout);
                    }
                } else if (error) {
                    console.error('C++ String Engine Error:', error);
                    console.error('Stderr:', stderr);
                }
                
                return res.status(500).json({ success: false, message: 'Engine execution failed.' });
            });

            // Write inputs to stdin
            child.stdin.write(text + '\n');
            child.stdin.write(pattern + '\n');
            child.stdin.end();
            return;
        }

        return res.status(500).json({ success: false, message: 'String Engine binary not found.' });

    } catch (error) {
        console.error('String Controller Error:', error);
        return res.status(500).json({ success: false, message: 'String Engine execution error.' });
    }
};

module.exports = { runStringAlgorithm };
