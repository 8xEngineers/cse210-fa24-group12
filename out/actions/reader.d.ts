import * as vscode from 'vscode';
import * as J from '..';
export declare class Reader {
    ctrl: J.Util.Ctrl;
    constructor(ctrl: J.Util.Ctrl);
    /**
  * Returns the page for a day with the given input. If the page doesn't exist yet,
  * it will be created (with the current date as header)
  *
  * @param {input} input with offset 0 is today, -1 is yesterday
  * @returns {Q.Promise<vscode.TextDocument>} the document
  * @memberof Reader
  */
    loadEntryForInput(input: J.Model.Input): Promise<vscode.TextDocument>;
    /**
     * Loads the weekly page for the given week number (of the year)
     * @param week the week of the current year
     */
    loadEntryForWeek(week: Number): Promise<vscode.TextDocument>;
    /**
     * Loads the journal entry for the given date. If no entry exists, promise is rejected with the invalid path
     *
     * @param {Date} date the date for the entry
     * @returns {Q.Promise<vscode.TextDocument>} the document
     * @throws {string} error message
     * @memberof Reader
     */
    loadEntryForDay(date: Date): Promise<vscode.TextDocument>;
}
