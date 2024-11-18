import * as vscode from 'vscode';
import * as J from '..';
/**
 * Anything which extends Visual Studio Code goes here
 *
 */
export declare class Dialogues {
    ctrl: J.Util.Ctrl;
    private scanner;
    constructor(ctrl: J.Util.Ctrl);
    /**
     *
     */
    getUserInputWithValidation(): Promise<J.Model.Input>;
    private generateDescription;
    private generateDetail;
    private collectScanDirectories;
    /**
     *
     * @param type
     */
    pickItem(type: J.Model.JournalPageType): Promise<J.Model.Input>;
    /**
     * Simple method to have Q Promise for vscode API call to get user input
     */
    getUserInput(tip: string): Promise<string>;
    saveDocument(textDocument: vscode.TextDocument): Promise<vscode.TextDocument>;
    openDocument(path: string | vscode.Uri): Promise<vscode.TextDocument>;
    /**
     * Shows the given document in Visual Studio Code
     *
     * @param {vscode.TextDocument} textDocument the document to show
     * @returns {vscode.TextEditor} the associated text editor
     * @memberOf VsCode
     */
    showDocument(textDocument: vscode.TextDocument): Promise<vscode.TextEditor>;
    showError(error: string | Error): Promise<void>;
    private showErrorInternal;
}
