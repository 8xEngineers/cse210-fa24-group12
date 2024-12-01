import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as J from '../..';
import { LoadNotes } from '../../provider';
// Removed unused imports: ShowEntryForInputCommand, ShowEntryForTodayCommand
import { TestLogger } from '../TestLogger';

suite('Test Notes Syncing', () => {

    // Helper function to open today's journal and return the editor
    async function openTodayJournal(): Promise<vscode.TextEditor> {
        await vscode.commands.executeCommand("journal.today");
        const editor = vscode.window.activeTextEditor; // Changed `let` to `const`
        assert.ok(editor, "Failed to open today's journal");
        return editor;
    }

    test('Sync notes', async () => {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal"); // Changed `let` to `const`
        const ctrl = new J.Util.Ctrl(config); // Changed `let` to `const`
        ctrl.logger = new TestLogger(false); 

        // Create a new entry.. remember length
        const editor = await openTodayJournal(); // Changed `let` to `const`
        const originalLength = editor.document.getText().length; // Changed `let` to `const`
        assert.ok(originalLength > 0, "Nothing in document"); 

        // Create a new note
        const input = new J.Model.NoteInput(); // Changed `let` to `const`
        input.text = "This is a test note";
        const notesDoc: vscode.TextDocument = await new LoadNotes(input, ctrl).load(); // Changed `let` to `const`
        const notesEditor = await ctrl.ui.showDocument(notesDoc); // Changed `let` to `const`
        assert.ok(notesEditor, "Failed to open note");

        // Wait for a moment
        await new Promise(resolve => setTimeout(resolve, 2000));  

        const editorAgain = await openTodayJournal(); // Changed `let` to `const`
        const newLength = editorAgain.document.getText().length; // Changed `let` to `const`
        
        assert.ok(newLength > originalLength, "Notes link wasn't injected"); 
    }).timeout(5000);
});
