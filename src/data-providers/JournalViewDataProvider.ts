import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface JournalElement {
    type: 'path' | 'entry' | 'note';
    name: string;
    displayName: string;
    file: string;
    id: number;
    icon?: string;
    date?: Date;
    notes?: JournalElement[];
    clickable?: boolean;
    visible: boolean;
    parent?: JournalElement;
    elements?: JournalElement[];
}

class JournalViewDataProvider implements vscode.TreeDataProvider<JournalElement> {
    private _onDidChangeTreeData = new vscode.EventEmitter<JournalElement | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    
    private elements: JournalElement[] = [];
    private usedHashes = new Set<number>();
    private buildCounter = 1;
    
    private readonly noteRegex: RegExp;
    private readonly entryRegex: RegExp;

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly outputChannel?: vscode.OutputChannel
    ) {
        const extension = this.getFileExtension();
        this.noteRegex = new RegExp(`\\d{4}${path.sep}\\d{2}${path.sep}\\d{2}${path.sep}.*${extension}$`);
        this.entryRegex = new RegExp(`\\d{4}${path.sep}\\d{2}${path.sep}\\d{2}${extension}$`);
    }

    private getFileExtension(): string {
        const extension = vscode.workspace.getConfiguration('journal').get<string>('ext', '');
        return extension.startsWith('.') ? extension : `.${extension}`;
    }

    private debug(text: string): void {
        this.outputChannel?.appendLine(text);
    }

    private getIcon(name: string): { light: string; dark: string } {
        return {
            light: this.context.asAbsolutePath(path.join('resources/icons', 'light', `${name}.svg`)),
            dark: this.context.asAbsolutePath(path.join('resources/icons', 'dark', `${name}.svg`))
        };
    }

    private formatMonth(monthNumber: string): string {
        const date = new Date(1970, parseInt(monthNumber) - 1, 15);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const userDate = new Date(date.getTime() - userTimezoneOffset);
        return userDate.toLocaleString(vscode.env.language, { month: 'long' });
    }

    private formatDay(date: Date): string {
        const nth = (n: number): string => {
            const suffixes = ['st', 'nd', 'rd'];
            const suffix = suffixes[((n + 90) % 100 - 10) % 10 - 1] || 'th';
            return suffix;
        };

        return `${date.toLocaleString(vscode.env.language, { weekday: 'long' })} ${date.getDate()}${nth(date.getDate())}`;
    }

    private generateHash(text: string): number {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        hash = Math.abs(hash) % 1000000;

        while (this.usedHashes.has(hash)) {
            hash++;
        }

        this.usedHashes.add(hash);
        return hash;
    }

    getTreeItem(element: JournalElement): vscode.TreeItem {

        const treeItem = new vscode.TreeItem(
            element.displayName + (''),
            this.getCollapsibleState(element)
        );

        if (!element.id) {
            treeItem.id = element.id.toString();
        }
        else{
            treeItem.id = undefined;
        }


        if (element.file) {
            treeItem.resourceUri = vscode.Uri.file(element.file);
        }

        if (element.icon) {
            treeItem.iconPath = this.getIcon(element.icon);
        }

        if (element.clickable) {
            treeItem.command = {
                command: 'vscode-journal-view.open',
                title: '',
                arguments: [element.file]
            };
        }

        return treeItem;
    }

    private getCollapsibleState(element: JournalElement): vscode.TreeItemCollapsibleState {
        if (element.type === 'path') {
            return vscode.workspace.getConfiguration('vscode-journal-view').get('expanded', false)
                ? vscode.TreeItemCollapsibleState.Expanded
                : vscode.TreeItemCollapsibleState.Collapsed;
        }
        return vscode.TreeItemCollapsibleState.None;
    }

    private insertElement(element: JournalElement): void {
        const fullPath = element.file;
        const parts = path.relative(path.dirname(fullPath), fullPath).split(path.sep);
        
        let currentLevel = this.elements;
        let currentParent: JournalElement | undefined;
        
        // Build the path hierarchy
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            let pathElement = currentLevel.find(e => e.name === part);
            
            if (!pathElement) {
                // Create new path element if it doesn't exist
                pathElement = {
                    type: 'path',
                    name: part,
                    displayName: this.getPathDisplayName(part, i),
                    file: path.join(path.dirname(fullPath), ...parts.slice(0, i + 1)),
                    id: (this.buildCounter * 1000000) + this.generateHash(part),
                    elements: [],
                    visible: true,
                    parent: currentParent
                };
                
                if (i === 1) { // Month level
                    pathElement.displayName = this.formatMonth(part);
                }
                
                currentLevel.push(pathElement);
                currentLevel.sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
            }
            
            currentParent = pathElement;
            currentLevel = pathElement.elements || [];
        }
        
        // Set the parent of the new element
        element.parent = currentParent;
        
        // Add the element to its parent's children
        if (currentParent) {
            if (!currentParent.elements) {
                currentParent.elements = [];
            }
            currentParent.elements.push(element);
            currentParent.elements.sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
        } else {
            this.elements.push(element);
            this.elements.sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
        }
    }

    private getPathDisplayName(part: string, level: number): string {
        if (level === 1) { // Month level
            return this.formatMonth(part);
        }
        return part;
    }


    getChildren(element?: JournalElement): JournalElement[] {
        if (!element) {
            const roots = this.elements.filter(e => e.visible);
            return roots.length > 0 ? roots : [{ displayName: 'Nothing found' } as JournalElement];
        }

        if (element.type === 'path') {
            return element.elements?.filter(e => e.visible) || [];
        }

        if (element.type === 'entry' && element.notes) {
            return element.notes;
        }

        return [];
    }

    getParent(element: JournalElement): JournalElement | undefined {
        return element.parent;
    }

    add(rootFolder: string, entryPath: string): void {
        const isNote = this.noteRegex.test(entryPath);
        const isEntry = this.entryRegex.test(entryPath);
        
        if (!isNote && !isEntry && !vscode.workspace.getConfiguration('vscode-journal-view').get('showNonJournalFiles', false)) {
            return;
        }

        //const fullPath = path.resolve(rootFolder, entryPath);
        const element = this.createJournalElement(rootFolder, entryPath, isNote, isEntry);
        
        if (element) {
            this.insertElement(element);
            this.debug(`Added: ${JSON.stringify(element)}`);
        }
    }

    private createJournalElement(rootFolder: string, entryPath: string, isNote: boolean, isEntry: boolean): JournalElement | undefined {
        const fullPath = path.resolve(rootFolder, entryPath);
        const relativePath = path.relative(rootFolder, entryPath);
        const parts = relativePath.split(path.sep);

        const element: JournalElement = {
            type: isNote ? 'note' : (isEntry ? 'entry' : 'path'),
            name: parts[parts.length - 1],
            displayName: this.getDisplayName(parts, isNote, isEntry),
            file: fullPath,
            id: (this.buildCounter * 1000000) + this.generateHash(fullPath),
            icon: isNote ? 'notes' : 'journal-entry',
            clickable: true,
            visible: true
        };

        if (isNote || isEntry) {
            const date = this.getDateFromParts(parts);
            if (date) {
                element.date = date;
            }
        }

        return element;
    }

    private getDisplayName(parts: string[], isNote: boolean, isEntry: boolean): string {
        if (isEntry) {
            const date = this.getDateFromParts(parts);
            return date ? this.formatDay(date) : parts[parts.length - 1];
        }
        
        if (isNote) {
            return path.basename(parts[parts.length - 1], this.getFileExtension()).replace(/_/g, ' ');
        }

        return parts[parts.length - 1];
    }

    private getDateFromParts(parts: string[]): Date | undefined {
        if (parts.length >= 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            return new Date(year, month, day);
        }
        return undefined;
    }

    getElement(rootFolder: string, date: string): JournalElement | undefined {
        try {
            const fullPath = path.resolve(rootFolder, date);
            const relativePath = path.relative(rootFolder, fullPath);
            const parts = relativePath.split(path.sep);

            let level = 0;
            let found: JournalElement | undefined;
            let current = this.findElementAtLevel(this.elements, parts[level]);

            while (current) {
                level++;
                found = current;

                const part = this.adjustPartForLevel(parts[level], level);
                if (!part) break;

                current = current.elements ? 
                    this.findElementAtLevel(current.elements, part) : 
                    undefined;
            }

            return found;
        } catch (error) {
            this.debug(`Error in getElement: ${error}`);
            return undefined;
        }
    }

    private findElementAtLevel(elements: JournalElement[], name: string): JournalElement | undefined {
        return elements.find(element => element.name === name);
    }

    private adjustPartForLevel(part: string | undefined, level: number): string | undefined {
        if (!part) return undefined;

        // // Add extension to day-level entries if needed
        // if (level === 2 && !part.endsWith(this.getExt())) {
        //     return part + this.getExt();
        // }

        return part;
    }


    clear(): void {
        this.debug('clear');
        this.usedHashes.clear();
        this.elements = [];
    }

    rebuild(): void {
        this.debug('rebuild');
        this.usedHashes.clear();
        this.buildCounter = (this.buildCounter + 1) % 100;
    }

    refresh(): void {
        this.debug('refresh');
        this._onDidChangeTreeData.fire(undefined);
        vscode.commands.executeCommand('setContext', 'journal-tree-has-content', this.elements.length > 0);
    }

    setAllVisible(visible: boolean, children: JournalElement[] = this.elements): void {
        children.forEach(child => {
            child.visible = visible;
            if (child.elements) {
                this.setAllVisible(visible, child.elements);
            }
        });
    }
}

export default JournalViewDataProvider;
