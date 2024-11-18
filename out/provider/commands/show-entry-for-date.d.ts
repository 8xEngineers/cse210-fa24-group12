import * as vscode from 'vscode';
import * as J from '../..';
export declare class AbstractLoadEntryForDateCommand implements vscode.Disposable {
    ctrl: J.Util.Ctrl;
    protected constructor(ctrl: J.Util.Ctrl);
    dispose(): Promise<void>;
    /**
     * Implements commands "yesterday", "today", "yesterday", where the input is predefined (no input box appears)
     * @param offset
     */
    execute(input: J.Model.Input): Promise<void>;
    /**
     * Expects any user input from the magic input and either opens the file or creates it.
     * @param input
     */
    protected loadPageForInput(input: J.Model.Input): Promise<vscode.TextDocument>;
}
