import * as vscode from 'vscode';
import * as J from '../..';
export declare class PrintSumCommand implements vscode.Command, vscode.Disposable {
    ctrl: J.Util.Ctrl;
    title: string;
    command: string;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
        * Prints the sum of the selected numbers in the current editor at the selection location
        */
    execute(): Promise<void>;
}
