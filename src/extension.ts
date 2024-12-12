// Copyright (C) 2018  Patrick Maué
//
// This file is part of vscode-journal.
//
// vscode-journal is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// vscode-journal is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with vscode-journal.  If not, see <http://www.gnu.org/licenses/>.
//

'use strict';

import * as vscode from 'vscode';
import * as J from './';

import TagDataProvider from './data-providers/TagDataProvider';
import RegisterCommands from './RegisterCommands';
import RegisterDataProviders from './RegisterDataProviders';
import JournalDataProvider from './data-providers/JournalDataProvider';
import { TodoDataProvider } from './data-providers/TodoDataProvider';

export let journalStartup: J.Extension.Startup;
export let journalConfiguration: J.Extension.Configuration;

export function activate(context: vscode.ExtensionContext) {
    try {
        console.time("startup");

        // Initialize Journal Extension
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("journal");
        journalStartup = new J.Extension.Startup(config);
        journalStartup.run(context);

        // Initialize Tagged Files Functionality
        const tagDataProvider = new TagDataProvider(context);
        const registerCommands = new RegisterCommands(context, tagDataProvider);
        const registerDataProviders = new RegisterDataProviders(tagDataProvider);

        // Register all Tagged Files commands and data providers
        [
            ...registerCommands.registerAll(),
            ...registerDataProviders.registerAll()
        ].forEach(sub => context.subscriptions.push(sub));

        // Initialize Journal View Functionality
        // console.log("Initializing JournalDataProvider");
        const journalDataProvider = new JournalDataProvider(context);

        // Determine initial expansion from configuration
        const initialExpanded = vscode.workspace.getConfiguration('vscode-journal-view').get<boolean>('expanded', false);
        vscode.commands.executeCommand('setContext', 'treeViewExpanded', initialExpanded);

        // Register Journal View for Explorer
        const journalViewExplorer = vscode.window.createTreeView('journalViewExplorer', { treeDataProvider: journalDataProvider });
        context.subscriptions.push(journalViewExplorer);

        // Register Journal View for Activity Bar
        const journalViewActivityBar = vscode.window.createTreeView('journalViewActivityBar', { treeDataProvider: journalDataProvider });
        context.subscriptions.push(journalViewActivityBar);

        //console.log("Journal view registered");

        // Register Journal View Commands
        context.subscriptions.push(
            vscode.commands.registerCommand('journal-view.refresh', () => journalDataProvider.refresh()),
            vscode.commands.registerCommand('journal-view.open', (filePath: string) => {
                vscode.workspace.openTextDocument(filePath).then(doc => vscode.window.showTextDocument(doc));
            }),
            vscode.commands.registerCommand('journal-view.today', () => {
                //console.log('Jump to Today executed');
                journalDataProvider.jumpToToday();
            }),
            vscode.commands.registerCommand('journal-view.expandAll', () => {
                journalDataProvider.expandAll();
                vscode.commands.executeCommand('setContext', 'treeViewExpanded', true);
            }),
            vscode.commands.registerCommand('journal-view.collapseAll', () => {
                journalDataProvider.collapseAll();
                vscode.commands.executeCommand('setContext', 'treeViewExpanded', false);
            }),
            vscode.commands.registerCommand('journal-view.filter', async () => {
                const input = await vscode.window.showInputBox({ placeHolder: 'Enter text to filter journal entries' });
                if (input !== undefined) {
                    journalDataProvider.setFilter(input);
                    vscode.commands.executeCommand('setContext', 'filterApplied', Boolean(input.trim()));
                }
            }),
            vscode.commands.registerCommand('journal-view.clear-filter', () => {
                journalDataProvider.clearFilter();
                vscode.commands.executeCommand('setContext', 'filterApplied', false);
            })
        );

        // Initialize TODO Data Provider
        //console.log("Initializing TodoDataProvider");
        const todoDataProvider = new TodoDataProvider(context);

        // Register TODO View in Explorer
        const todoView = vscode.window.createTreeView('todoView', { treeDataProvider: todoDataProvider });
        context.subscriptions.push(todoView);

        // Register TODO Commands
        context.subscriptions.push(
            vscode.commands.registerCommand('todo-view.refresh', () => todoDataProvider.refresh()),
            vscode.commands.registerCommand('todo-view.openTodo', (filePath: string, lineNumber: number) => {
                vscode.workspace.openTextDocument(filePath).then(doc => {
                    vscode.window.showTextDocument(doc, { preview: false }).then(editor => {
                        const position = new vscode.Position(lineNumber, 0);
                        editor.selection = new vscode.Selection(position, position);
                        editor.revealRange(new vscode.Range(position, position));
                    });
                });
            })
        );

        // Refresh the providers on Activation
        journalDataProvider.refresh();
        todoDataProvider.refresh();

        console.timeEnd("startup");

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

// Deactivate function
export function deactivate() {}