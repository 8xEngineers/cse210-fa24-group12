import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import JournalViewDataProvider from '../data-providers/JournalViewDataProvider';

class RefreshJournalView {
    private journalDataProvider: JournalViewDataProvider;
    private currentFilter?: string;

    constructor(
        private context: vscode.ExtensionContext,
        journalDataProvider: JournalViewDataProvider,
    ) {
        this.journalDataProvider = journalDataProvider;
    }

    async execute(): Promise<void> {
        try {
            this.journalDataProvider.clear();
            this.currentFilter = undefined;
            await vscode.commands.executeCommand('setContext', 'vscode-journal-view-is-filtered', false);

            const rootFolder = this.getRootFolder();
            const files = await this.scanDirectory(rootFolder);

            if (files && files.length > 0) {
                files.forEach(filePath => {
                    this.journalDataProvider.add(rootFolder, filePath);
                });
            }

            this.journalDataProvider.refresh();
        } catch (error) {
            console.error('Failed to refresh journal view:', error);
            throw error;
        }
    }

    private async scanDirectory(dir: string): Promise<string[]> {
        const extension = this.getExtension();
        const results: string[] = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    const subResults = await this.scanDirectory(fullPath);
                    results.push(...subResults);
                } else if (entry.isFile() && path.extname(fullPath) === extension) {
                    results.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error scanning directory ${dir}:`, error);
        }

        return results;
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

export default RefreshJournalView;