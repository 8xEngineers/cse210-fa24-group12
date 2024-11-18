import * as vscode from 'vscode';
import * as J from '../..';
/**
 * Feature responsible for finding existing references to notes in current view as well as scanning the configured folders for unreferenced files.
 * Syncs the two lists with the goal, to have easy access to all notes from the journal entries.
 */
export declare class SyncNoteLinks {
    ctrl: J.Util.Ctrl;
    constructor(ctrl: J.Util.Ctrl);
    /**
    * Checks for the given text document if it contains references to notes (and if there are notes in the associated folders)
    * It compares the two lists and creates (or deletes) any missing links
    *
    * @param doc
    */
    injectAttachementLinks(doc: vscode.TextDocument, date: Date): Promise<vscode.TextDocument>;
    getFilesInNotesFolderAllScopes(doc: vscode.TextDocument, date: Date): Promise<vscode.Uri[]>;
    /**
    * Returns a list of files sitting in the notes folder for the current document (has to be a journal page)
    *
    * By making the notes folder configurable, we cannot differentiate anymore by path. We always find
    * (and inject all notes). We therefore also check the last modification date of the file itself
    *
    * @param {vscode.TextDocument} doc the current journal entry
    * @returns {Q.Promise<ParsedPath[]>} an array with all files sitting in the directory associated with the current journal page
    * @memberof Reader
    */
    getFilesInNotesFolder(doc: vscode.TextDocument, date: Date, scope: string): Promise<vscode.Uri[]>;
    /**
   *  Returns a list of all local files referenced in the given document.
   *
   * @param {vscode.TextDocument} doc the current journal entry
   * @returns {Q.Promise<string[]>} an array with all references in  the current journal page
   * @memberof Reader
   */
    getReferencedFiles(doc: vscode.TextDocument): Promise<vscode.Uri[]>;
    /**
 * Injects a reference to a file associated with the given document. The reference location can be configured in the template (after-flag)
 * @param doc the document which we will inject into
 * @param file the referenced path
 */
    private buildReference;
}
