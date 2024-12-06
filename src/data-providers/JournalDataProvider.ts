import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class JournalDataProvider implements vscode.TreeDataProvider<JournalTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<JournalTreeItem | undefined | void> = new vscode.EventEmitter<JournalTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<JournalTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private allJournalEntries: JournalTreeItem[] = []; // Unfiltered full tree
    private journalEntries: JournalTreeItem[] = [];    // Filtered view
    private isExpanded: boolean;
    private refreshVersion: number = 0;
    private filterText: string = '';

    constructor(private context: vscode.ExtensionContext) {
        this.isExpanded = vscode.workspace.getConfiguration('vscode-journal-view').get<boolean>('expanded', false);
    }

    refresh(): void {
        console.log("Refreshing journal view...");
        // Load full entries
        this.allJournalEntries = [];
        this.loadJournalEntries();
        // Apply filter
        if (this.filterText) {
            this.journalEntries = this.filterTree(this.allJournalEntries, this.filterText);
        } else {
            this.journalEntries = this.allJournalEntries;
        }

        console.log("Journal Entries Structure: ", JSON.stringify(this.journalEntries, null, 2));
        this._onDidChangeTreeData.fire();
    }

    expandAll(): void {
        console.log("Expanding all nodes...");
        this.isExpanded = true;
        this.refreshVersion++;
        this.refresh();
    }

    collapseAll(): void {
        console.log("Collapsing all nodes...");
        this.isExpanded = false;
        this.refreshVersion++;
        this.refresh();
    }

    setFilter(filterText: string): void {
        console.log("Setting filter:", filterText);
        this.filterText = filterText.trim();
        this.refresh();
    }

    clearFilter(): void {
        console.log("Clearing filter...");
        this.filterText = '';
        this.refresh();
    }

    jumpToToday(): void {
        const baseDir = path.resolve(require('os').homedir(), 'Journal');
        if (!fs.existsSync(baseDir)) {
            vscode.window.showWarningMessage(`Journal base directory does not exist: ${baseDir}`);
            return;
        }

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        const filePath = path.join(baseDir, year, month, `${day}.md`);

        if (fs.existsSync(filePath)) {
            vscode.workspace.openTextDocument(filePath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        } else {
            vscode.window.showWarningMessage(`Today's journal entry does not exist: ${filePath}`);
        }
    }

    getTreeItem(element: JournalTreeItem): vscode.TreeItem {
        console.log("Using cached value for 'vscode-journal-view.expanded':", this.isExpanded);

        const treeItem = new vscode.TreeItem(
            element.label,
            element.children.length > 0
                ? (this.isExpanded
                    ? vscode.TreeItemCollapsibleState.Expanded
                    : vscode.TreeItemCollapsibleState.Collapsed)
                : vscode.TreeItemCollapsibleState.None
        );

        treeItem.id = element.id;
        treeItem.resourceUri = element.resourceUri;
        treeItem.command = element.command;
        treeItem.iconPath = element.iconPath;

        return treeItem;
    }

    getChildren(element?: JournalTreeItem): JournalTreeItem[] | Thenable<JournalTreeItem[]> {
        if (!element) {
            return this.journalEntries;
        }
        return element.children || [];
    }

    private loadJournalEntries(): void {
        const baseDir = path.resolve(require('os').homedir(), 'Journal');
        if (!fs.existsSync(baseDir)) {
            vscode.window.showWarningMessage(`Journal base directory does not exist: ${baseDir}`);
            return;
        }

        const years = fs.readdirSync(baseDir).filter(file => fs.statSync(path.join(baseDir, file)).isDirectory());

        years.forEach(year => {
            const yearPath = path.join(baseDir, year);
            const months = fs.readdirSync(yearPath).filter(file => fs.statSync(path.join(yearPath, file)).isDirectory());

            const yearItem = new JournalTreeItem(
                year,
                this.isExpanded ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
                vscode.Uri.file(yearPath),
                undefined,
                undefined,
                this.refreshVersion
            );

            months.forEach(month => {
                const monthPath = path.join(yearPath, month);
                const days = fs.readdirSync(monthPath).filter(file => file.endsWith('.md'));

                const monthItem = new JournalTreeItem(
                    this.getMonthName(month),
                    this.isExpanded ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
                    vscode.Uri.file(monthPath),
                    undefined,
                    undefined,
                    this.refreshVersion
                );

                days.forEach(day => {
                    const dayPath = path.join(monthPath, day);
                    const dayName = this.getDayName(day, month, year);

                    const dayItem = new JournalTreeItem(
                        dayName,
                        vscode.TreeItemCollapsibleState.None,
                        vscode.Uri.file(dayPath),
                        {
                            command: 'journal-view.open',
                            title: 'Open Journal Entry',
                            arguments: [dayPath]
                        },
                        {
                            light: path.join(__dirname, '..', 'icons', 'light', 'journal-entry.svg'),
                            dark: path.join(__dirname, '..', 'icons', 'dark', 'journal-entry.svg')
                        },
                        this.refreshVersion
                    );

                    monthItem.children.push(dayItem);
                });

                yearItem.children.push(monthItem);
            });

            this.allJournalEntries.push(yearItem);
        });
    }

    private getMonthName(monthNumber: string): string {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const index = parseInt(monthNumber, 10) - 1;
        return months[index] || "Invalid Month";
    }

    private getDayName(dayFileName: string, month: string, year: string): string {
        const dayNumber = parseInt(dayFileName.replace('.md', ''), 10);
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, dayNumber);
        const daySuffix = ["th", "st", "nd", "rd"][(dayNumber % 10) - 1] || "th";
        const weekday = date.toLocaleString("en-US", { weekday: "long" });
        return `${weekday} ${dayNumber}${daySuffix}`;
    }

    /**
     * Filter the tree based on filterText.
     * This function returns a new array of items that match the filter:
     * - Leaf nodes must contain the filterText in their label to be included.
     * - Non-leaf nodes are included if they have at least one descendant that matches.
     */
    private filterTree(items: JournalTreeItem[], filterText: string): JournalTreeItem[] {
        const result: JournalTreeItem[] = [];
        for (const item of items) {
            if (item.children.length === 0) {
                // Leaf node
                if (item.label.toLowerCase().includes(filterText.toLowerCase())) {
                    // Matches filter
                    result.push(this.cloneItem(item));
                }
            } else {
                // Non-leaf node
                const filteredChildren = this.filterTree(item.children, filterText);
                if (filteredChildren.length > 0) {
                    const newItem = this.cloneItem(item);
                    newItem.children = filteredChildren;
                    result.push(newItem);
                }
            }
        }
        return result;
    }

    private cloneItem(item: JournalTreeItem): JournalTreeItem {
        const newItem = new JournalTreeItem(
            item.label,
            item.collapsibleState,
            item.resourceUri,
            item.command,
            item.iconPath,
            this.refreshVersion
        );
        return newItem;
    }
}

class JournalTreeItem extends vscode.TreeItem {
    children: JournalTreeItem[] = [];

    constructor(
        public readonly label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly resourceUri?: vscode.Uri,
        public readonly command?: vscode.Command,
        public readonly iconPath?: { light: string; dark: string },
        private version: number = 0
    ) {
        super(label, collapsibleState);
        if (iconPath) {
            this.iconPath = iconPath;
        }
        this.id = (resourceUri ? resourceUri.toString() : label) + `-v${version}`;
    }
}

export default JournalDataProvider;
