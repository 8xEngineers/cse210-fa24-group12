import * as vscode from 'vscode';
import * as J from '../..';
export declare class ShowNoteCommand implements vscode.Command, vscode.Disposable {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
     * Creates a new file for a note following the configured pattern
     * Shows the file to let the user start adding notes right away.
     */
    execute(): Promise<void>;
}
