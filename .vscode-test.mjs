import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/test/**/*.test.js',  // Location of your test files
    workspaceFolder: '.',  // Root workspace folder
    mocha: {
        timeout: 20000  // Timeout in milliseconds
    },
    useSeparateWorkspacePerTest: true,
    version: 'stable'  // or specify a version like '1.60.0'
});