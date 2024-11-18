import * as vscode from 'vscode';
import * as J from '../..';
/**
 * Feature responsible for creating (if needed) and loading notes given a user input as title.
 * (extracted as feature to enable direct unit tests)
*/
export declare class LoadNotes {
    input: J.Model.Input;
    ctrl: J.Util.Ctrl;
    constructor(input: J.Model.Input, ctrl: J.Util.Ctrl);
    load(): Promise<vscode.TextDocument>;
    loadWithPath(path: string): Promise<vscode.TextDocument>;
    /**
   * Creates or loads a note
   *
   * @param {string} path
   * @param {string} content
   * @returns {Promise<vscode.TextDocument>}
   * @memberof Writer
   */
    loadNote(path: string, content: string): Promise<vscode.TextDocument>;
}
