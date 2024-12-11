import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as J from '../..';
import { TestLogger } from '../TestLogger';
import { suite, test} from 'mocha';

// Helper function to reduce duplication in date input tests
async function testDateInput(inputString: string, expectedOffsetCondition: (offset: number) => boolean) {
	const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
	const ctrl = new J.Util.Ctrl(config);
	ctrl.logger = new TestLogger(false); 

	const parser = new J.Actions.Parser(ctrl);
	const input = await parser.parseInput(inputString); 

	assert.strictEqual(expectedOffsetCondition(input.offset), true);
}

suite('Open Journal Entries', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Simple', async () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	}); 

	test("Input '+1'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false); 

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("+1"); 

		assert.strictEqual(1, input.offset);
	}); 

	test("Input '2021-05-12'", async () => {
		testDateInput("2021-05-12", (offset) => offset > 0 || offset <= 0);
	});

	test("Input '05-12'", async () => {
		testDateInput("05-12", (offset) => offset > 0 || offset <= 0);
	});

	test("Input '12'", async () => {
		testDateInput("12", (offset) => offset > 0 || offset <= 0);
	});

	test("Input 'next monday'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false); 

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("next monday"); 

		assert.ok(input.offset > 0, "Offset not > 0, is " + input.offset); 
	});

	test("Input 'next tue'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false); 

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("next tue"); 

		assert.ok(input.offset > 0, "Offset not > 0, is " + input.offset); 
	});

	test("Input 'last wed'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false); 

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("last wed"); 

		assert.ok(input.offset < 0, "Offset not < 0, is " + input.offset); 
	});

	test("Input 'task +1 do this'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false);

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("task +1 text");

		assert.ok(input.offset > 0, "Offset not > 0, is " + input.offset);
		assert.ok(input.hasFlags(), "Input has no flags " + JSON.stringify(input));
		assert.ok(input.hasTask(), "Input has no task flag " + JSON.stringify(input));
		assert.ok(input.text.length > 0, "Input has no text " + JSON.stringify(input));
	});

	test("Input 'task next wed do this'", async () => {
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
		const ctrl = new J.Util.Ctrl(config);
		ctrl.logger = new TestLogger(false);

		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("task next wed text");

		assert.ok(input.offset > 0, "Offset not > 0, is " + input.offset);
		assert.ok(input.hasFlags(), "Input has no flags " + JSON.stringify(input));
		assert.ok(input.hasTask(), "Input has no task flag " + JSON.stringify(input));
		assert.ok(input.text.length > 0, "Input has no text " + JSON.stringify(input));
	});
});
