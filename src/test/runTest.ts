import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '');

	        // The path to the extension test script
	        const extensionTestsPath = path.resolve(__dirname, '');
	
	        // Testint github work flow. No test to run for now.
	        console.log('Setup check complete. No tests to run.');
	        console.log(`Development Path: ${extensionDevelopmentPath}`);
	        console.log(`Tests Path: ${extensionTestsPath}`);
		// dummyt test
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();