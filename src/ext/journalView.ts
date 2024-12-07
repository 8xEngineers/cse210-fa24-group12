import * as vscode from 'vscode';
import * as TreeView from './dataProvider'; // Adjust the path if necessary
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import findInFile from 'find-in-file';

export function activate(context: vscode.ExtensionContext) {
    const shouldDebug = vscode.workspace.getConfiguration('vscode-journal-view').debug;
    const outputChannel = shouldDebug ? vscode.window.createOutputChannel("vscode-journal-view") : undefined;

    let currentSearchTerm: RegExp | undefined;
    vscode.commands.executeCommand('setContext', 'vscode-journal-view-is-filtered', false);

    const provider = new TreeView.JournalDataProvider(context, outputChannel);
    const journalViewExplorer = vscode.window.createTreeView("vscode-journal-view-explorer", { treeDataProvider: provider });
    const journalView = vscode.window.createTreeView("vscode-journal-view", { treeDataProvider: provider });

    const decorationType = vscode.window.createTextEditorDecorationType({
        overviewRulerColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: { backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground') },
        dark: { backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground') }
    });

    function getExt(): string {
        let extension = vscode.workspace.getConfiguration('journal').ext;
        if (extension.indexOf('.') === -1) {
            extension = '.' + extension;
        }
        return extension;
    }

    function revealToday(revealInExplorer: boolean) {
        const today = new Date().toISOString().substr(0, 10).replace(/\-/g, path.sep) + getExt();
        const node = provider.getElement(getRootFolder(), today);
        if (node) {
            if (revealInExplorer) {
                journalViewExplorer.reveal(node);
            } else {
                journalView.reveal(node);
            }
        }
    }

    function scan(dir: string, done: (err: Error | null, results?: string[]) => void) {
        const extension = getExt();
        const results: string[] = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            let i = 0;
            (function next() {
                const file = list[i++];
                if (!file) return done(null, results);
                const filePath = path.join(dir, file);
                fs.stat(filePath, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        scan(filePath, (err, res) => {
                            results.push(...res);
                            next();
                        });
                    } else {
                        if (path.extname(filePath) === extension) {
                            results.push(filePath);
                        }
                        next();
                    }
                });
            })();
        });
    }

    function getRootFolder(): string {
        let rootFolder = vscode.workspace.getConfiguration('journal').base;
        if (rootFolder === "") {
            rootFolder = path.resolve(os.homedir(), "Journal");
        } else {
            if (rootFolder[0] === '~') {
                rootFolder = os.homedir() + rootFolder.substring(1);
            }
            rootFolder = rootFolder.replace("${homeDir}", os.homedir());
            rootFolder = path.normalize(rootFolder);
            rootFolder = path.format(path.parse(rootFolder));
        }
        return rootFolder;
    }

    function isJournalFile(filename: string): boolean {
        const rootFolder = getRootFolder();
        return rootFolder ? filename.indexOf(rootFolder.substr(1)) === 1 : false;
    }

    function refresh() {
        provider.clear();
        currentSearchTerm = undefined;
        vscode.commands.executeCommand('setContext', 'vscode-journal-view-is-filtered', false);

        const rootFolder = getRootFolder();
        scan(rootFolder, (error, files) => {
            if (files) {
                files.forEach(filePath => {
                    provider.add(rootFolder, filePath);
                });
            }
            provider.refresh();
        });
    }

    function search(term: string) {
        const rootFolder = getRootFolder();
        scan(rootFolder, (error, files) => {
            let count = files.length;
            provider.setAllVisible(false);

            if (files) {
                files.forEach(filePath => {
                    findInFile({ files: filePath, find: new RegExp(term, 'gi') }, (err, matched) => {
                        if (!err && matched.length > 0) {
                            provider.setVisible(rootFolder, filePath);
                        }
                        if (--count === 0) {
                            provider.refresh();
                        }
                    });
                });
            }
        });

        const editor = vscode.window.activeTextEditor;
        if (editor && isJournalFile(editor.document.fileName)) {
            highlightSearchTerm(false);
        }
    }

    function highlightSearchTerm(positionCursor: boolean) {
        const terms: vscode.DecorationOptions[] = [];
        let position: vscode.Position | undefined;

        const editor = vscode.window.activeTextEditor;

        if (currentSearchTerm) {
            const text = editor.document.getText();
            let match;
            while (match = currentSearchTerm.exec(text)) {
                const startPos = editor.document.positionAt(match.index);
                const endPos = editor.document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                terms.push(decoration);

                if (position === undefined) {
                    position = startPos;
                }
            }
        }
        editor.setDecorations(decorationType, terms);

        if (positionCursor) {
            if (position === undefined) {
                position = new vscode.Position(2, 0);
            }

            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(editor.selection, vscode.TextEditorRevealType.Default);
        }
    }

    function clearFilter() {
        currentSearchTerm = undefined;
        vscode.commands.executeCommand('setContext', 'vscode-journal-view-is-filtered', false);
        provider.setAllVisible(true);
        provider.refresh();
    }

    function setButtons() {
        const expanded = vscode.workspace.getConfiguration('vscode-journal-view').expanded;
        vscode.commands.executeCommand('setContext', 'vscode-journal-view-show-expand', !expanded);
        vscode.commands.executeCommand('setContext', 'vscode-journal-view-show-collapse', expanded);
    }

    function collapse() {
        vscode.workspace.getConfiguration('vscode-journal-view').update('expanded', false, false);
    }

    function expand() {
        vscode.workspace.getConfiguration('vscode-journal-view').update('expanded', true, false);
    }

    function register() {
        vscode.window.registerTreeDataProvider('vscode-journal-view', provider);

        vscode.commands.registerCommand('vscode-journal-view.open', (file: string) => {
            vscode.workspace.openTextDocument(file).then(document => {
                vscode.window.showTextDocument(document).then(editor => {
                    vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
                    highlightSearchTerm(file !== document.fileName);
                });
            });
        });

        context.subscriptions.push(vscode.commands.registerCommand('vscode-journal-view.refresh', refresh));
        context.subscriptions.push(vscode.commands.registerCommand('vscode-journal-view.expand', expand));
        context.subscriptions.push(vscode.commands.registerCommand('vscode-journal-view.collapse', collapse));
        context.subscriptions.push(vscode.commands.registerCommand('vscode-journal-view.search', () => {
            vscode.window.showInputBox({ prompt: "Search the journal" }).then(term => {
                currentSearchTerm = term !== undefined ? new RegExp(term, 'gi') : undefined;
                if (term) {
                    vscode.commands.executeCommand('setContext', 'vscode-journal-view-is-filtered', true);
                    search(term);
                }
            });
        }));

        context.subscriptions.push(vscode.commands.registerCommand('vscode-journal-view.clearFilter', clearFilter));

        refresh();
        setButtons();
    }

    register();
}

export function deactivate() {} 