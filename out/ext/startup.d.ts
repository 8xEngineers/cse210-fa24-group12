import * as vscode from 'vscode';
import * as J from '..';
export declare class Startup {
    config: vscode.WorkspaceConfiguration;
    private ctrl;
    constructor(config: vscode.WorkspaceConfiguration);
    run(context: vscode.ExtensionContext): Promise<void>;
    private initialize;
    registerLoggingChannel(ctrl: J.Util.Ctrl, context: vscode.ExtensionContext): Promise<J.Util.Ctrl>;
    /**
     * Planned for 0.13
     *
     * @param ctrl
     * @param context
     * @returns
     */
    registerCodeLens(ctrl: J.Util.Ctrl, context: vscode.ExtensionContext): Promise<J.Util.Ctrl>;
    registerCommands(ctrl: J.Util.Ctrl, context: vscode.ExtensionContext): Promise<void>;
    registerCodeActions(ctrl: J.Util.Ctrl, context: vscode.ExtensionContext): Promise<void>;
    getConfiguration(): J.Extension.Configuration;
    getJournalController(): J.Util.Ctrl;
    registerSyntaxHighlighting(ctrl: J.Util.Ctrl): Promise<J.Util.Ctrl>;
    disableSyntaxHighlighting(ctrl: J.Util.Ctrl): Promise<J.Util.Ctrl>;
    /**
     * Sets default syntax highlighting settings on startup, we try to differentiate between dark and light themes
     *
     * @param {J.Util.Ctrl} ctrl
     * @param {vscode.ExtensionContext} context
     * @returns {Q.Promise<J.Util.Ctrl>}
     * @memberof Startup
     */
    enableSyntaxHighlighting(ctrl: J.Util.Ctrl): Promise<J.Util.Ctrl>;
}
