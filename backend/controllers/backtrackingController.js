const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const CPP_BINARY_PATH = path.join(__dirname, '../cpp/backtracking_engine.exe');

const runBacktrackingAlgorithm = async (req, res) => {
    try {
        const { algorithm = 'nqueens', size = 4 } = req.body;

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
                        console.error('Failed to parse C++ Backtracking Engine JSON output:', e);
                        console.error('Raw stdout:', stdout);
                    }
                } else if (error) {
                    console.error('C++ Backtracking Engine Error:', error);
                    console.error('Stderr:', stderr);
                }
                
                return res.status(500).json({ success: false, message: 'Engine execution failed.' });
            });

            // Write size to stdin
            child.stdin.write(size.toString() + '\n');
            child.stdin.end();
            return;
        }

        return res.status(500).json({ success: false, message: 'Backtracking Engine binary not found.' });

    } catch (error) {
        console.error('Backtracking Controller Error:', error);
        return res.status(500).json({ success: false, message: 'Backtracking Engine execution error.' });
    }
};

module.exports = { runBacktrackingAlgorithm };
