import * as vscode from 'vscode';
import * as J from '../..';
export declare class PrintDurationCommand implements vscode.Command, vscode.Disposable {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
     * Called by command 'Journal:printDuration'. Requires three selections (three active cursors)
     * in current document. It identifies which of the selections are times (in the format hh:mm
     *  or glued like "1223") and where to print the duration (in decimal form).
     * For now the duration is always printing hours.
     */
    printDuration(): Promise<void>;
}
