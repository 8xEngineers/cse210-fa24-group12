import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as J from '../..';
import { LoadNotes } from '../../provider';
import { ShowEntryForInputCommand, ShowEntryForTodayCommand } from '../../provider/commands';
import { TestLogger } from '../TestLogger';
import { suite, test, afterEach } from 'mocha';

suite('Test Notes Syncing', () => {
    let testNotePath: string | undefined;

    // Helper function to open today's journal and return the editor
    async function openTodayJournal(): Promise<vscode.TextEditor> {
        await vscode.commands.executeCommand("journal.today");
        let editor = vscode.window.activeTextEditor;
        assert.ok(editor, "Failed to open today's journal");
        return editor;
    }

    test('Sync notes', async () => {
        let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");

        let ctrl = new J.Util.Ctrl(config);
        ctrl.logger = new TestLogger(false); 

        // create a new entry.. remember length
        let editor = await openTodayJournal();  
        let originalLength = editor.document.getText().length;

        assert.ok(originalLength > 0, "Nothing in document"); 

        // create a new note
        let input = new J.Model.NoteInput(); 
        input.text = "This is a test note";

        let notesDoc: vscode.TextDocument = await new LoadNotes(input, ctrl).load();
        
        // Store the path of the test note for cleanup
        testNotePath = notesDoc.uri.fsPath;

        let notesEditor = await ctrl.ui.showDocument(notesDoc); 
        assert.ok(notesEditor, "Failed to open note");

        await new Promise(resolve => setTimeout(resolve, 2000));  

        let editorAgain = await openTodayJournal();
        let newLength = editorAgain.document.getText().length; 
        assert.ok(newLength > originalLength, `Notes link wasn't injected. Original length: ${originalLength}, New length: ${newLength}`);
    }).timeout(5000); 
});