import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface TodoItem {
    file: string;
    lineNumber: number;
    text: string;
}

export class TodoDataProvider implements vscode.TreeDataProvider<TodoTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoTreeItem | undefined | void> = new vscode.EventEmitter<TodoTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TodoTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private todoItemsByFile: Map<string, TodoItem[]> = new Map();

    constructor(private context: vscode.ExtensionContext) {}

    /**
     * Refreshes the TODO tree by scanning the workspace.
     */
    refresh(): void {
        this.scanWorkspaceForTodos().then(() => {
            this._onDidChangeTreeData.fire();
        });
    }

    /**
     * Provides the TreeItem representation for each TodoTreeItem.
     */
    getTreeItem(element: TodoTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Provides the children for each TreeItem.
     */
    getChildren(element?: TodoTreeItem): vscode.ProviderResult<TodoTreeItem[]> {
        if (!element) {
            // Top-level: show files containing TODOs
            const files = Array.from(this.todoItemsByFile.keys());
            return files.map(file => new TodoTreeItem(
                path.relative(vscode.workspace.rootPath || '', file),
                vscode.TreeItemCollapsibleState.Collapsed,
                file,
                undefined,
                false
            ));
        } else {
            if (element.isFile) {
                // Return the TODO items for that file
                const todos = this.todoItemsByFile.get(element.fullPath) || [];
                return todos.map(todo => new TodoTreeItem(
                    `Line ${todo.lineNumber + 1}: ${todo.text}`,
                    vscode.TreeItemCollapsibleState.None,
                    element.fullPath,
                    {
                        command: 'todo-view.openTodo',
                        title: 'Open TODO',
                        arguments: [element.fullPath, todo.lineNumber]
                    },
                    true
                ));
            }
        }
    }

    /**
     * Scans the workspace for files containing #TODO comments.
     */
    private async scanWorkspaceForTodos(): Promise<void> {
        this.todoItemsByFile.clear();

        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return;
        }

        const workspaceRoot = folders[0].uri.fsPath;

        // Search for TODOs in all files
        const allFiles = await this.getAllFiles(workspaceRoot);
        for (const file of allFiles) {
            const todoItems = await this.findTodosInFile(file);
            if (todoItems.length > 0) {
                this.todoItemsByFile.set(file, todoItems);
            }
        }
    }

    /**
     * Recursively retrieves all file paths in the given directory.
     */
    private async getAllFiles(dir: string): Promise<string[]> {
        const dirents = fs.readdirSync(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getAllFiles(res) : [res];
        }));
        return Array.prototype.concat(...files);
    }

    /**
     * Finds all lines containing #TODO in a given file.
     */
    private async findTodosInFile(filePath: string): Promise<TodoItem[]> {
        const todoItems: TodoItem[] = [];

        // Optionally, limit scanning to certain file types
        const allowedExtensions = ['.js', '.ts', '.md', '.py', '.java', '.c', '.cpp', '.cs']; // Extend as needed
        if (!allowedExtensions.includes(path.extname(filePath))) {
            return todoItems;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const todoIndex = line.toLowerCase().indexOf('#todo'); // Case-insensitive search
                if (todoIndex !== -1) {
                    // Extract text after '#TODO'
                    const todoText = line.substring(todoIndex + '#TODO'.length).trim();
                    if (todoText.length > 0) { // Ensure there's text after '#TODO'
                        todoItems.push({
                            file: filePath,
                            lineNumber: i,
                            text: todoText
                        });
                    }
                }
            }
        } catch (err) {
            // Handle read errors, e.g., permissions or binary files
            console.error(`Error reading file ${filePath}:`, err);
        }

        return todoItems;
    }
}

class TodoTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly fullPath: string,
        public readonly command?: vscode.Command,
        public readonly isTodoItem: boolean = false
    ) {
        super(label, collapsibleState);
        this.contextValue = isTodoItem ? 'todoItem' : 'todoFile';
        if (isTodoItem) {
            this.iconPath = new vscode.ThemeIcon('checklist');
        } else {
            this.iconPath = new vscode.ThemeIcon('file');
        }
    }

    /**
     * Indicates whether this TreeItem represents a file.
     */
    get isFile(): boolean {
        return !this.isTodoItem;
    }
}
