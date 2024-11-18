import * as vscode from 'vscode';
import * as J from '../.';
export declare class Inject {
    ctrl: J.Util.Ctrl;
    constructor(ctrl: J.Util.Ctrl);
    /**
     * Adds a new memo or task to today's page. A memo/task is a one liner (entered in input box),
     * which can be used to quickly write down ToDos without leaving your current
     * document.
     *
     * @param {vscode.TextDocument} doc
     * @param {J.Model.Input} input
     * @returns {Q.Promise<vscode.TextDocument>}
     * @memberof Inject
     */
    injectInput(doc: vscode.TextDocument, input: J.Model.Input): Promise<vscode.TextDocument>;
    /**
     * Builds inline string from given input using the provided document. Computes range at the location configured in the Inline Template (the "after"-flag). If no after is present,
     * content will be injected after the header
     *
     * @param {vscode.TextDocument} doc
     * @param {J.Extension.InlineTemplate} tpl
     * @param {...string[][]} values
     * @param {number} multiple number of edits which are to be expected (with the same template) to collect and avoid concurrent edits
     * @returns {Q.Promise<vscode.TextDocument>}
     * @memberof Inject
     *
     * Updates: Fix for  #55, always make sure there is a linebreak between the header and the injected text to stay markdown compliant
     */
    buildInlineString(doc: vscode.TextDocument, tpl: J.Model.InlineTemplate, ...values: string[][]): Promise<J.Model.InlineString>;
    adjustLineBreak(tpl: J.Model.InlineTemplate, content: string): string;
    computePositionForInput(doc: vscode.TextDocument, tpl: J.Model.InlineTemplate): vscode.Position;
    /**
     * Injects a string into the given position within the given document.
     *
     * @param doc the vscode document
     * @param content the string which is to be injected
     * @param position the position where we inject the string
     */
    injectString(doc: vscode.TextDocument, content: string, position: vscode.Position): Promise<vscode.TextDocument>;
    /**
     * Injects the string at the given position.
     *
     * @param content the @see InlineString to be injected
     * @param other additional InlineStrings
     *
     */
    injectInlineString(content: J.Model.InlineString, ...other: J.Model.InlineString[]): Promise<vscode.TextDocument>;
    private formatContent;
    /**
     * Injects the given string as header (first line of file)
     *
     * @param {vscode.TextDocument} doc the input file
     * @param {string} content the string to be injected as header
     * @returns {Q.Promise<vscode.TextDocument>} the updated document
     * @memberOf Inject
     */
    injectHeader(doc: vscode.TextDocument, content: string): Promise<vscode.TextDocument>;
    /**
     * Builds the content of newly created notes file using the (scoped) configuration and the user input.
     *1
     * @param {J.Model.Input} input what the user has entered
     * @returns {Q.Promise<string>} the built content
     * @memberof Inject
     */
    formatNote(input: J.Model.Input): Promise<string>;
}
