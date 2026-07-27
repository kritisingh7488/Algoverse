const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const CPP_BINARY_PATH = path.join(__dirname, '../cpp/tree_engine.exe');

const runTreeOperation = async (req, res) => {
    try {
        const {
            treeType = 'bst',
            opName = 'inorder',
            val = '42',
            input = [50, 25, 75, 15, 35, 65, 85],
            dataType = 'Integer'
        } = req.body;

        const inputArr = Array.isArray(input) ? input.map(x => String(x)) : String(input).split(/\s+/);
        const inputString = inputArr.join(' ');

        if (fs.existsSync(CPP_BINARY_PATH)) {
            const env = { ...process.env, PATH: `${process.env.PATH};C:\\msys64\\ucrt64\\bin` };
            
            const child = execFile(
                CPP_BINARY_PATH,
                [treeType, opName, String(val), String(dataType || 'Integer')],
                { env },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('C++ execution error:', error, 'stderr:', stderr);
                        return res.status(500).json({ success: false, message: 'C++ engine execution failed: ' + (stderr || error.message) });
                    }
                    if (stdout) {
                        try {
                            const parsed = JSON.parse(stdout);
                            if (parsed.success) {
                                return res.json({ success: true, data: parsed });
                            }
                        } catch (e) {
                            console.error('Failed to parse C++ Tree JSON output:', e, 'Raw stdout:', stdout.slice(0, 200));
                            return res.status(500).json({ success: false, message: 'Failed to parse C++ engine output.' });
                        }
                    }
                    return res.status(500).json({ success: false, message: 'C++ engine produced empty output.' });
                }
            );

            child.stdin.write(inputString);
            child.stdin.end();
            return;
        }

        return res.status(500).json({ success: false, message: 'C++ Tree Engine binary not found. Please compile tree_engine.cpp.' });

    } catch (error) {
        console.error('Tree Controller Error:', error);
        return res.status(500).json({ success: false, message: 'C++ Tree Engine execution error.' });
    }
};

module.exports = { runTreeOperation };
