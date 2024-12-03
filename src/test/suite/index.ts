import * as path from 'path';
import Mocha from 'mocha';

// Import the test files explicitly
import '../../../test/commands/TagFile.test';
import '../../../test/data-providers/TagDataProvider.test';

export function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true,
    });

    const testsRoot = path.join(__dirname, '..');

    return new Promise((c, e) => {
        // Automatically add any other test files
        const testFiles = [
            '../../../test/commands/TagFile.test',
            '../../../test/data-providers/TagDataProvider.test',
        ];

        testFiles.forEach((file) => {
            const absolutePath = path.join(testsRoot, file);
            mocha.addFile(absolutePath);
        });

        try {
            mocha.run((failures) => {
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                } else {
                    c();
                }
            });
        } catch (err) {
            console.error(err);
            e(err);
        }
    });
}
