import { exec } from 'child_process';
import path from 'path';

/**
 * Calls the Python ML script to predict MBTI type
 * @param text Combined answers from the quiz
 * @returns Predicted MBTI string (e.g., 'INTJ')
 */
export const predictMBTI = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const venvPython = path.join(__dirname, '../../ml/venv/bin/python3');
        const scriptPath = path.join(__dirname, '../../ml/predict.py');

        // Sanitize input text for shell
        const sanitizedText = text.replace(/["']/g, '');

        const cmd = `"${venvPython}" "${scriptPath}" "${sanitizedText}"`;
        console.log(`Executing ML Command: ${cmd}`);
        console.log(`Current Working Dir: ${process.cwd()}`);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`ML Prediction Process Error: ${error.message}`);
                console.error(`ML Prediction Error Stderr: ${stderr}`);
                return reject('Failed to process personality traits');
            }
            console.log(`ML Prediction Output: ${stdout.trim()}`);
            resolve(stdout.trim());
        });
    });
};
