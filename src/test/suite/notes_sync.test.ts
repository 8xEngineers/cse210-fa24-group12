import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as J from '../..';
import { LoadNotes } from '../../provider';
import { TestLogger } from '../TestLogger';

suite('Test Notes Syncing', () => {

    // Helper function to open today's journal and return the editor
    async function openTodayJournal(): Promise<vscode.TextEditor> {
        await vscode.commands.executeCommand("journal.today");
        const editor = vscode.window.activeTextEditor;
        assert.ok(editor, "Failed to open today's journal");
        return editor;
    }

    test('Sync notes', async () => {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
        const ctrl = new J.Util.Ctrl(config);
        ctrl.logger = new TestLogger(false); 

        // create a new entry.. remember length
        const editor = await openTodayJournal();
        const originalLength = editor.document.getText().length;
        
        assert.ok(originalLength > 0, "Nothing in document"); 

        // create a new note
        const input = new J.Model.NoteInput();
        input.text = "This is a test note";
        const notesDoc: vscode.TextDocument = await new LoadNotes(input, ctrl).load();
        const notesEditor = await ctrl.ui.showDocument(notesDoc);
        assert.ok(notesEditor, "Failed to open note");

        await new Promise(resolve => setTimeout(resolve, 2000));  

        const editorAgain = await openTodayJournal();
        const newLength = editorAgain.document.getText().length;
        
        assert.ok(newLength > originalLength, "Notes link wasn't injected"); 
    }).timeout(5000);
});
