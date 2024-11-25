import * as assert from 'assert';
import moment from 'moment';
import * as vscode from 'vscode';
import * as J from '../..';  // Adjust this path to match your extension's main file
import { TestLogger } from '../TestLogger';

// Utility function to create a new Ctrl instance
const createCtrl = () => {
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
    const ctrl = new J.Util.Ctrl(config);
    ctrl.logger = new TestLogger(false);
    return ctrl;
};

// Utility function to run common assertions 
const runCommonAssertions = (input: any, expectedWeek: number) => {
    assert.ok(!input.hasOffset(), "Offset is set, is " + input.offset);
    assert.ok(!input.hasFlags(), "Input has flags " + JSON.stringify(input));
    assert.ok(!input.hasTask(), "Input has task flag " + JSON.stringify(input));
    assert.ok(!input.hasText(), "Input has no text " + JSON.stringify(input));
    assert.ok(input.hasWeek(), "Input has no week definition " + JSON.stringify(input));
    assert.strictEqual(input.week, expectedWeek, "weeks mismatch");
};

suite('Open Week Entries', () => {
    let ctrl: J.Util.Ctrl;

    suiteSetup(async () => {
        // Activate extension
        const ext = vscode.extensions.getExtension('your.extension.id');
        await ext?.activate();
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