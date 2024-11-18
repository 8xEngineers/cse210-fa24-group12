import * as vscode from 'vscode';
import * as J from '../..';
/**
 * The complete task codelens is active for open tasks, e.g. '-[ ] some text'
 *
 * Once activated, it will
 * - close the task: '-[ ] some text' -> '-[x] some text'
 * - annotate the task with completion date: '-[x] some text (completed on 2021-05-12 at 12:12)'
 */
export declare class CompletedTaskActions implements vscode.CodeActionProvider {
    private ctrl;
    private regex;
    static readonly providedCodeActionKinds: vscode.CodeActionKind[];
    constructor(ctrl: J.Util.Ctrl);
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]>;
    private createReinstateTask;
    private getAnnotationRange;
    private getTaskBoxRange;
    private matchesExpression;
}
