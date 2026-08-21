const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const ext = process.platform === 'win32' ? '.exe' : '.out';
const CPP_BINARY_PATH = path.join(__dirname, `../cpp/dp_engine${ext}`);

const runDPAlgorithm = async (req, res) => {
    try {
        const { 
            algorithm = 'fibonacci', 
            approach = 'tabulation', 
            n = 5, 
            array = [2, 7, 9, 3, 1],
            coins = [1, 2, 5],
            target = 11,
            str = "226"
        } = req.body;

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

            // Write custom inputs sequentially based on the algorithm type
            let inputString = "";
            if (algorithm === 'fibonacci' || algorithm === 'climbing-stairs' || algorithm === 'climbing' || algorithm === 'perfect-squares' || algorithm === 'integer-break') {
                inputString = `${n}\n`;
            } 
            else if (algorithm === 'house-robber-i' || algorithm === 'house-robber-ii' || algorithm === 'frog-jump') {
                const arr = Array.isArray(array) ? array : array.split(',').map(Number);
                inputString = `${arr.length}\n${arr.join(' ')}\n`;
            } 
            else if (algorithm === 'decode-ways') {
                inputString = `${str}\n`;
            } 
            else if (algorithm === 'coin-change' || algorithm === 'minimum-coins') {
                const coinArr = Array.isArray(coins) ? coins : coins.split(',').map(Number);
                inputString = `${target}\n${coinArr.length}\n${coinArr.join(' ')}\n`;
            }

            child.stdin.write(inputString);
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
