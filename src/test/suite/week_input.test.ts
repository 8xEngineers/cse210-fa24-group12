import * as assert from 'assert';
import moment from 'moment';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as J from '../..';
import { TestLogger } from '../TestLogger';
import { suite, before, test } from 'mocha';

// Utility function to create a new Ctrl instance
const createCtrl = () => {
	const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
	const ctrl = new J.Util.Ctrl(config);
	ctrl.logger = new TestLogger(false);
	return ctrl;
};

// Utility function to run common assertions are provided below
const runCommonAssertions = (input: J.Model.Input, expectedWeek: number) => {
	assert.ok(!input.hasOffset(), "Offset is set, is " + input.offset);
	assert.ok(!input.hasFlags(), "Input has flags " + JSON.stringify(input));
	assert.ok(!input.hasTask(), "Input has task flag " + JSON.stringify(input));
	assert.ok(!input.hasText(), "Input has no text " + JSON.stringify(input));
	assert.ok(input.hasWeek(), "Input has no week definition " + JSON.stringify(input));
	assert.strictEqual(input.week, expectedWeek, "weeks mismatch");
};

suite('Open Week Entries', () => {
	vscode.window.showInformationMessage('Start all tests.');
	let ctrl: J.Util.Ctrl; 

	before(() => {
		ctrl = createCtrl();
	}); 

	test("Input 'w13'", async () => {
		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("w13");

		runCommonAssertions(input, 13);
	});

	test("Input 'w'", async () => {
		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("w");
		const currentWeek = moment().week();

		runCommonAssertions(input, currentWeek);
	});

	test("Input 'next week'", async () => {
		const parser = new J.Actions.Parser(ctrl);
		const input = await parser.parseInput("next week");

		const currentWeek = moment().week();

		runCommonAssertions(input, currentWeek + 1);
	});
});
