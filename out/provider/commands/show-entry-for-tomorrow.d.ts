import * as vscode from 'vscode';
import * as J from '../..';
import { AbstractLoadEntryForDateCommand } from './show-entry-for-date';
export declare class ShowEntryForTomorrowCommand extends AbstractLoadEntryForDateCommand {
    title: string;
    command: string;
    static create(ctrl: J.Util.Ctrl): vscode.Disposable;
}
