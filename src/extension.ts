'use strict';

import * as vscode from 'vscode';
import * as J from './';
import JournalViewDataProvider from './data-providers/JournalViewDataProvider';  // Add new provider
import TagDataProvider from './data-providers/TagDataProvider';
import RegisterCommands from './RegisterCommands';
import RegisterDataProviders from './RegisterDataProviders';

export let journalStartup: J.Extension.Startup;
export let journalConfiguration: J.Extension.Configuration;

export function activate(context: vscode.ExtensionContext) {
    try {
        console.time("startup");

        // Initialize Journal Extension
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
        journalStartup = new J.Extension.Startup(config);
        journalStartup.run(context);

        const shouldDebug = config.get('debug', false);
        const outputChannel = shouldDebug ? vscode.window.createOutputChannel("vscode-journal") : undefined;
    
        // Initialize provider
        const journalViewDataProvider = new JournalViewDataProvider(context, outputChannel);
        const tagDataProvider = new TagDataProvider(context);
        const registerCommands = new RegisterCommands(context, tagDataProvider, journalViewDataProvider);
        const registerDataProviders = new RegisterDataProviders(tagDataProvider, journalViewDataProvider);

        // const journalViewExplorer = vscode.window.createTreeView( "vscode-journal-view-explorer", { treeDataProvider: journalViewDataProvider } );
        // const journalView = vscode.window.createTreeView( "vscode-journal-view", { treeDataProvider: journalViewDataProvider} );
    

        // Register all commands and data providers
        [
            ...registerCommands.registerAll(),
            ...registerDataProviders.registerAll()
        ].forEach(sub => context.subscriptions.push(sub));

        // Return public API of the Journal Extension
        return {
            getJournalConfiguration() {
                return journalStartup.getJournalController().config;
            }
        };
    } catch (error) {
        console.error("Failed to start the extension with reason: ", error);
        throw error;
    }
}

// function initializeJournalView(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
//     const shouldDebug = config.get('debug', false);
//     const outputChannel = shouldDebug ? vscode.window.createOutputChannel("vscode-journal") : undefined;

//     // Initialize provider
//     const journalViewProvider = new JournalViewDataProvider(context, outputChannel);

//     // Create tree views
//     const journalViewExplorer = vscode.window.createTreeView("vscode-journal.explorer", {
//         treeDataProvider: journalViewProvider
//     });

//     viewCommands.forEach(command => context.subscriptions.push(command));
// }

export function deactivate() {
}