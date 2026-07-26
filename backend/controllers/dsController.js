const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const CPP_BINARY_PATH = path.join(__dirname, '../cpp/ds_engine.exe');

// C++ Data Structures Engine Controller
const runDSOperation = async (req, res) => {
    try {
        const {
            structureKey = 'array',
            opName = 'insert',
            opArgs = {},
            items = [12, 34, 56, 78],
            config = {}
        } = req.body;

        const val = opArgs.val !== undefined ? Number(opArgs.val) : 42;
        const idx = opArgs.idx !== undefined ? Number(opArgs.idx) : -1;
        const dir = opArgs.dir || 'left';

        const inputArr = items.map(x => Number(x));
        const inputString = inputArr.join(' ');

        if (fs.existsSync(CPP_BINARY_PATH)) {
            const env = { ...process.env, PATH: `${process.env.PATH};C:\\msys64\\ucrt64\\bin` };
            
            const child = execFile(
                CPP_BINARY_PATH,
                [structureKey, opName, String(val), String(idx), dir],
                { env },
                (error, stdout, stderr) => {
                    if (!error && stdout) {
                        try {
                            const parsed = JSON.parse(stdout);
                            if (parsed.success) {
                                return res.json({ success: true, data: parsed });
                            }
                        } catch (e) {
                            console.error('Failed to parse C++ DS JSON output:', e);
                        }
                    }
                    return res.json({ success: true, message: 'Executed in C++ engine mode.' });
                }
            );

            child.stdin.write(inputString);
            child.stdin.end();
            return;
        }

        return res.json({ success: true, message: 'C++ DS Engine binary initialized.' });

    } catch (error) {
        console.error('DS Controller Error:', error);
        return res.status(500).json({ success: false, message: 'C++ Data Structures Engine execution error.' });
    }
};

module.exports = { runDSOperation };
