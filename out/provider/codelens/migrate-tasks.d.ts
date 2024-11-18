import * as vscode from 'vscode';
import * as J from '../..';
/**
 * The migrate task codelens is only active for the tasks header (as configured in settings, default is '## Tasks') for today's journal entry.
 *
 * Once activated, it scans the previous entries (last 20 entries) and copies any open tasks to today's entry.
 * For each identified open task, it will trigger the according shift action for the given range.
 *
 *
 */
export declare class MigrateTasksCodeLens implements vscode.CodeLensProvider {
    private codeLenses;
    private ctrl;
    private _onDidChangeCodeLenses;
    constructor(ctrl: J.Util.Ctrl);
    getRegex(): Promise<RegExp>;
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]>;
    resolveCodeLens?(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.CodeLens | Thenable<vscode.CodeLens>;
}
