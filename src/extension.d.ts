import * as vscode from 'vscode';
import * as J from './';
export declare let journalStartup: J.Extension.Startup;
export declare let journalConfiguration: J.Extension.Configuration;
export declare function activate(context: vscode.ExtensionContext): {
    getJournalConfiguration(): J.Extension.Configuration;
};
export declare function deactivate(): void;
