const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        console.log('Initializing test environment...');

        // The folder containing the Extension Manifest package.json
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        console.log(`Extension development path: ${extensionDevelopmentPath}`);

        // The path to the extension test script
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        console.log(`Extension tests path: ${extensionTestsPath}`);

        // Ensure paths exist
        if (!path.isAbsolute(extensionDevelopmentPath) || !path.isAbsolute(extensionTestsPath)) {
            throw new Error('Invalid paths for extension development or tests.');
        }

        // Run the tests
        console.log('Starting integration tests...');
        await runTests({ extensionDevelopmentPath, extensionTestsPath });

        console.log('Integration tests completed successfully!');
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
