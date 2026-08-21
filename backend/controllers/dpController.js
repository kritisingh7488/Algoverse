const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const ext = process.platform === 'win32' ? '.exe' : '.out';
const CPP_BINARY_PATH = path.join(__dirname, `../cpp/dp_engine${ext}`);

const runDPAlgorithm = async (req, res) => {
    try {
        const { algorithm = 'fibonacci', approach = 'tabulation', n = 5 } = req.body;

        if (fs.existsSync(CPP_BINARY_PATH)) {
            const env = { ...process.env, PATH: `${process.env.PATH};C:\\msys64\\ucrt64\\bin` };
            
            // Pass algorithm and approach as command line parameters
            const child = execFile(CPP_BINARY_PATH, [algorithm, approach], { env }, (error, stdout, stderr) => {
                if (!error && stdout) {
                    try {
                        const parsed = JSON.parse(stdout);
                        if (parsed.success) {
                            return res.json(parsed);
                        }
                    } catch (e) {
                        console.error('Failed to parse C++ DP Engine JSON output:', e);
                        console.error('Raw stdout:', stdout);
                    }
                } else if (error) {
                    console.error('C++ DP Engine Error:', error);
                    console.error('Stderr:', stderr);
                }
                
                return res.status(500).json({ success: false, message: 'Engine execution failed.' });
            });

            // Write inputs to stdin
            child.stdin.write(n.toString() + '\n');
            child.stdin.end();
            return;
        }

        return res.status(500).json({ success: false, message: 'DP Engine binary not found.' });

    } catch (error) {
        console.error('DP Controller Error:', error);
        return res.status(500).json({ success: false, message: 'DP Engine execution error.' });
    }
};

module.exports = { runDPAlgorithm };
