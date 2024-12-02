import * as vscode from 'vscode';
import * as path from 'path';
import JournalDataProvider from '../data-providers/JournalViewDataProvider';

class RevealToday {
    private journalViewDataProvider: JournalDataProvider;
    private journalViewExplorer: vscode.TreeView<any>;
    private journalView: vscode.TreeView<any>;

    constructor(
        private inExplorer: boolean,
        private context: vscode.ExtensionContext,
        journalViewDataProvider: JournalDataProvider,
    ) {
        this.journalViewDataProvider = journalViewDataProvider;
        this.journalViewExplorer = vscode.window.createTreeView( "journalViewExplorer", { treeDataProvider: this.journalViewDataProvider } );
        this.journalView = vscode.window.createTreeView( "journalViewExplorer", { treeDataProvider: this.journalViewDataProvider } );
    }
    
    async execute(): Promise<void> {
        try {
            const today = this.getTodayPath();
            const rootFolder = this.getRootFolder();
            const node = this.journalViewDataProvider.getElement(rootFolder, today);

            if (node) {
                if (this.inExplorer) {
                    await this.journalViewExplorer.reveal(node);
                } else {
                    await this.journalView.reveal(node);
                }
            }
        } catch (error) {
            console.error('Failed to reveal today\'s entry:', error);
            throw error;
        }
    }

    private getTodayPath(): string {
        const today = new Date().toISOString().substring(0, 10);
        const ext = this.getExtension();
        return today.replace(/-/g, path.sep) + ext;
    }

    private getExtension(): string {
        const extension = vscode.workspace.getConfiguration('journal').get<string>('ext', 'md');
        return extension.startsWith('.') ? extension : `.${extension}`;
    }

    private getRootFolder(): string {
        const config = vscode.workspace.getConfiguration('journal');
        const rootFolder = config.get<string>('base', '');
        
        if (!rootFolder) {
            return path.join(process.env.HOME || process.env.USERPROFILE || '', 'Journal');
        }
        
        if (rootFolder.startsWith('~')) {
            return path.join(process.env.HOME || process.env.USERPROFILE || '', rootFolder.slice(1));
        }
        
        return path.normalize(rootFolder);
    }
}

export default RevealToday;