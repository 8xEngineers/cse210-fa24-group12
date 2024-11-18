import * as vscode from 'vscode';
import * as J from '../..';
export declare enum ShiftTarget {
    nextWorkingDay = 0,
    tomorrow = 1,
    today = 2,
    successorDay = 3
}
/**
 * The shift task command is active for open tasks, e.g. '-[ ] some text' and triggered by the codeaction in complete-task
 *
 * Once activated, it will
 * - shift the task to the next working day: '-[ ] some text' -> '-[>] some text'
 * - annotate the task with link to new entry: '-[>] some text (copied to [../13.md](2021-05-13))'
 * - insert the task to the entry of the new date: '-[ ] some text (copied from [../12.md](2021-05-12))'
 */
export declare class CopyTaskCommand implements vscode.Command {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    execute(document: vscode.TextDocument, text: string, target: ShiftTarget): Promise<void>;
    private insertTaskInNextWorkdDaysEntry;
    private insertTaskToTomorrowsEntry;
    private insertTaskToTodaysEntry;
    private insertTaskToEntry;
}
