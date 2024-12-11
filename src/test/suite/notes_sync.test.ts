import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as J from '../..';
import { LoadNotes } from '../../provider';
//import { ShowEntryForInputCommand, ShowEntryForTodayCommand } from '../../provider/commands';
import { TestLogger } from '../TestLogger';
import { suite, test, afterEach } from 'mocha';

suite('Test Notes Syncing', () => {
    let testNotePath: string | undefined;

    // Helper function to open today's journal and return the editor
    async function openTodayJournal(): Promise<vscode.TextEditor> {
        await vscode.commands.executeCommand("journal.today");
        const editor = vscode.window.activeTextEditor;
        assert.ok(editor, "Failed to open today's journal");
        return editor;
    }

    // Helper function to clean up test content from today's journal
    async function cleanupTodayJournal() {
        const editor = await openTodayJournal();
        const document = editor.document;
        const text = document.getText();
        
        // Remove the test note and any related content
        const cleanedText = text.replace(/- NOTE: \[This is a test note\].*\.md\)(\r?\n|$)/g, '');
        
        // Create a WorkspaceEdit to modify the file
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            ),
            cleanedText
        );

        // Apply the edit
        await vscode.workspace.applyEdit(edit);
        await document.save();
    }

    // Run cleanup after each test
    afterEach(async () => {
        if (testNotePath && fs.existsSync(testNotePath)) {
            fs.unlinkSync(testNotePath);
        }
        await cleanupTodayJournal();
    });

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
        
        // Store the path of the test note for cleanup
        testNotePath = notesDoc.uri.fsPath;

        const notesEditor = await ctrl.ui.showDocument(notesDoc); 
        assert.ok(notesEditor, "Failed to open note");

        await new Promise(resolve => setTimeout(resolve, 2000));  

        const editorAgain = await openTodayJournal();
        const newLength = editorAgain.document.getText().length; 
        assert.ok(newLength > originalLength, `Notes link wasn't injected. Original length: ${originalLength}, New length: ${newLength}`);
    }).timeout(5000); 
});