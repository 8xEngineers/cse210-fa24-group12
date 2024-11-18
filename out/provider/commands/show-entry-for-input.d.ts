import * as vscode from 'vscode';
import * as J from '../..';
import { AbstractLoadEntryForDateCommand } from './show-entry-for-date';
export declare class ShowEntryForInputCommand extends AbstractLoadEntryForDateCommand {
    title: string;
    command: string;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
    /**
     * Opens the editor for a specific day. Supported values are explicit dates (in ISO format),
     * offsets (+ or - as prefix and 0) and weekdays (next wednesday)
     *
     * Update: supports much more now
     */
    execute(): Promise<void>;
}
