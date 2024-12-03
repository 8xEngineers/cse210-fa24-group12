import * as assert from 'assert';
// Removed unused import of 'moment'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as J from '../..';
import { TestLogger } from '../TestLogger';
import { suite, before, test } from 'mocha';
// Removed unused imports: 'Ctrl', 'fstat', 'path'

suite('Read templates from configuration', () => {
    let ctrl: J.Util.Ctrl;

    before(() => {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal"); // Changed `let` to `const`
        ctrl = new J.Util.Ctrl(config);
        ctrl.logger = new TestLogger(true);
    });

    // Utility function to create Input objects
    const createInput = (text: string) => {
        const input = new J.Model.Input();
        input.text = text;
        return input;
    };

    test('Sync scopes', async () => {
        const scopes = ctrl.config.getScopes();
        assert.strictEqual(scopes.length, 3, "Invalid scope number");
    });

    test('Test resolving note paths', async () => {
        const inPriv = createInput("#priv a note created in private scope"); 
        const pathPriv = await ctrl.parser.resolveNotePathForInput(inPriv); 
        const uriPriv = vscode.Uri.file(pathPriv); 

        const inWork = createInput("#work a note created in work scope");
        const pathWork = await ctrl.parser.resolveNotePathForInput(inWork); 
        const uriWork = vscode.Uri.file(pathWork); 
        
        assert.ok(uriWork.path.match(/.*\/work\/.*/), "Wrong path to work note: "+uriWork.path);
        assert.ok(uriPriv.path.match(/\/private\//), "Wrong path to private note: "+uriPriv.path);
    }); 

    test('Create notes in different scopes', async () => {
        const scopes = ctrl.config.getScopes();
        assert.strictEqual(scopes.length, 3, "Invalid scope number");

        // Removed unused variable 'a'

        // Create a new note
        const privInput = await ctrl.parser.parseInput("#priv a note created in private scope");
        const privNotes = await new J.Provider.LoadNotes(privInput, ctrl); // Changed `let` to `const`
        let privDoc: vscode.TextDocument = await privNotes.load();
        privDoc = await ctrl.ui.saveDocument(privDoc); 
        const privUri = privDoc.uri; 

        const workInput = await ctrl.parser.parseInput("#work a note created in work scope");
        const workDoc: vscode.TextDocument = await new J.Provider.LoadNotes(workInput, ctrl).load(); // Changed `let` to `const`
        const savedWorkDoc = await ctrl.ui.saveDocument(workDoc); // Renamed variable to avoid shadowing
        const uriWork = savedWorkDoc.uri; 

        assert.ok(uriWork.path.match(/.*\/work\/.*/), "Wrong path to work note: "+uriWork.path);
        assert.ok(privUri.path.match(/\/private\//), "Wrong path to private note: "+privUri.path);
    }).timeout(50000);
});
