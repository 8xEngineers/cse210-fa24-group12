import * as vscode from 'vscode';
import * as J from '../..';
export declare class PrintTimeCommand implements vscode.Command, vscode.Disposable {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
    * Prints the current time at the cursor postion
    */
    printTime(): Promise<void>;
}
