const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const CPP_BINARY_PATH = path.join(__dirname, '../cpp/graph_engine.exe');

const runGraphOperation = async (req, res) => {
    try {
        const {
            graphType = 'undirected',
            algorithm = 'bfs',
            startNode = 0,
            targetNode = 5,
            kValue = 3,
            input = ''
        } = req.body;

        if (fs.existsSync(CPP_BINARY_PATH)) {
            const env = { ...process.env, PATH: `${process.env.PATH};C:\\msys64\\ucrt64\\bin` };
            
            const child = execFile(
                CPP_BINARY_PATH,
                [String(graphType), String(algorithm), String(startNode), String(targetNode), String(kValue)],
                { env },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('C++ Graph execution error:', error, 'stderr:', stderr);
                        return res.status(500).json({ success: false, message: 'C++ graph engine execution failed: ' + (stderr || error.message) });
                    }
                    if (stdout) {
                        try {
                            const parsed = JSON.parse(stdout);
                            if (parsed.success) {
                                return res.json({ success: true, data: parsed });
                            }
                        } catch (e) {
                            console.error('Failed to parse C++ Graph JSON output:', e, 'Raw stdout:', stdout.slice(0, 200));
                            return res.status(500).json({ success: false, message: 'Failed to parse C++ graph engine output.' });
                        }
                    }
                    return res.status(500).json({ success: false, message: 'C++ graph engine produced empty output.' });
                }
            );

            const inputString = typeof input === 'string' ? input : JSON.stringify(input);
            child.stdin.write(inputString);
            child.stdin.end();
            return;
        }

        return res.status(500).json({ success: false, message: 'C++ Graph Engine binary not found. Please compile graph_engine.cpp.' });

    } catch (error) {
        console.error('Graph Controller Error:', error);
        return res.status(500).json({ success: false, message: 'C++ Graph Engine execution error.' });
    }
};

module.exports = { runGraphOperation };
