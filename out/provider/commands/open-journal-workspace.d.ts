import * as vscode from 'vscode';
import * as J from '../..';
export declare class OpenJournalWorkspaceCommand implements vscode.Command, vscode.Disposable {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
     * Called by command 'Journal:open'. Opens a new windows with the Journal base directory as root.
     *
     * @returns {Q.Promise<void>}
     * @memberof JournalCommands
     */
    openWorkspace(): Promise<void>;
}
