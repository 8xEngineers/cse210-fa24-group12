import * as vscode from 'vscode';
import { HeaderTemplate, InlineTemplate, ScopedTemplate } from '../model';
export declare const SCOPE_DEFAULT: string;
/**
 * Manages access to journal configuration.
 *
 * Attention: This is an intermediate implementation, still based on the old configuration pre 0.6
 *
 */
export declare class Configuration {
    config: vscode.WorkspaceConfiguration;
    private patterns;
    constructor(config: vscode.WorkspaceConfiguration);
    getLocale(): string;
    /**
     * Returns all known scopes in the settings
     */
    getScopes(): string[];
    /**
     * The base path, defaults to %USERPROFILE/Journal
     *
     * Supported variables: ${homeDir}, ${workspaceRoot}, ${workspaceFolder}
     *
     * @param _scopeId
     */
    getBasePath(_scopeId?: string): string;
    /**
     * Configuration of file extension for notes and journal entries. Defaults to "md" for markdown.
     *
     *
     * @param _scopeId
     */
    getFileExtension(_scopeId?: string): string;
    isSyntaxHighlightingEnabled(): boolean;
    /**
 * Configuration for the path, where the notes are to be placed
 *
 * Supported variables: homeDir, base, year, month, day, moment
 *
 * @param _scopeId default or individual
 */
    getNotesPathPattern(_scopeId?: string): string;
    /**
     * Configuration for the path, where the notes are to be placed
     *
     * Supported variables: homeDir, base, year, month, day, moment
     *
     * @param _scopeId default or individual
     */
    getResolvedNotesPath(date: Date, _scopeId?: string): Promise<ScopedTemplate>;
    /**
     * Configuration for the filename, under which the notes file is stored
     *
     * Supported variables: year, month, day, df, ext, input
     *
     * @param _scopeId default or individual
     */
    getNotesFilePattern(date: Date, input: string, _scopeId?: string): Promise<ScopedTemplate>;
    getWeekFilePattern(week: Number, _scopeId?: string): any;
    getWeekPathPattern(week: Number, _scopeId?: string): any;
    /**
     * Configuration for the path, under which the  journal entry  file is stored
     *
     * Supported variables: base, year, month, day, df
     *
     * @param _scopeId default or individual
     */
    getEntryPathPattern(_scopeId?: string): string;
    /**
     * Configuration for the path, under which the  journal entry  file is stored
     *
     * Supported variables: base, year, month, day, df
     *
     * @param _scopeId default or individual
     */
    getResolvedEntryPath(date: Date, _scopeId?: string): Promise<ScopedTemplate>;
    /**
   * Configuration for the filename, under which the journal entry file is stored
   *
   * Supported variables: year, month, day, moment, ext
   *
   * @param _scopeId default or individual
   *
   * Update 05-2020: Really support scopes, directly access config to support live reloading
   */
    getEntryFilePattern(date: Date, _scopeId?: string): Promise<ScopedTemplate>;
    /**
     * Output format for calender format of moment.js, see https://momentjs.com/docs/#/displaying/calendar-time/
     *
     * Used in the quickpicker description. The default also includes the time, which we don't want.
     *
     * FIXME: Externalise to properties (multilanguage)
     */
    getInputDetailsTimeFormat(): {
        sameDay: string;
        nextDay: string;
        nextWeek: string;
        lastDay: string;
        lastWeek: string;
        sameElse: string;
    };
    /**
     * Helper Method, threshold (maximal age) of files shown in the quick picker
     */
    getInputTimeThreshold(): number;
    /**
     *
     * Retrieves the (scoped) inline template for a journal entry.
     *
     * Supported variables: localDate, year, month, day, format
     *
     * Default value is: "# ${localDate}\n\n",
     * @param {string} [_scopeId]
     * @returns {Q.Promise<FileTemplate>}
     * @memberof Configuration
     */
    getEntryTemplate(date: Date, _scopeId?: string): Promise<HeaderTemplate>;
    /**
         *
         * Retrieves the (scoped) inline template for a weekly entry.
         *
         * Supported variables: week number
         *
         * Default value is: "# Week ${week}\n\n",
         * @param {string} [_scopeId]
         * @returns {Q.Promise<FileTemplate>}
         * @memberof Configuration
         */
    getWeeklyTemplate(week: Number, _scopeId?: string): Promise<ScopedTemplate>;
    /**
       * Retrieves the (scoped) file template for a note.
       *
       * Default value is: "# ${input}\n\n",
       *
       * @param {string} [_scopeId]  identifier of the scope
       * @returns {Q.Promise<FileTemplate>} scoped file template for notes
       * @memberof Configuration
       */
    getNotesTemplate(_scopeId?: string): Promise<HeaderTemplate>;
    /**
     * Retrieves the (scoped) file template for a note.
     *
     * Default value is: "# {content}\n\n",
     *
     * @param {string} [_scopeId]
     * @returns {Q.Promise<FileTemplate>}
     * @memberof Configuration
     */
    getFileLinkInlineTemplate(_scopeId?: string): Promise<InlineTemplate>;
    /**
    * Retrieves the (scoped) inline template for a memo.
    *
    * Default value is: "- MEMO: {content}",
    *
    * @param {string} [_scopeId]
    * @returns {Q.Promise<InlineTemplate>}
    * @memberof Configuration
    */
    getMemoInlineTemplate(_scopeId?: string): Promise<InlineTemplate>;
    /**
     * Retrieves the (scoped) inline template for a task.
     *
     * Default value is: "- [ ] {content}",
     *
     * @param {string} [_scopeId]
     * @returns {Q.Promise<InlineTemplate>}
     * @memberof Configuration
     */
    getTaskInlineTemplate(_scopeId?: string): Promise<InlineTemplate>;
    /**
     * Returns the template used for printing the time
     *
     * Supported variables: localTime
     */
    getTimeString(): string | undefined;
    /**
     * Retrieves the (scoped) inline template for a time string.
     *
     * Default value is: "LT" (Local Time),
     *
     * @param {string} [_scopeId]
     * @returns {Q.Promise<InlineTemplate>}
     * @memberof Configuration
     */
    getTimeStringTemplate(_scopeId?: string): Promise<ScopedTemplate>;
    isDevelopmentModeEnabled(): boolean;
    isOpenInNewEditorGroup(): boolean;
    /***** PRIVATES *******/
    /**
     * Returns a valid scope, falls back to default.
     *
     * @param _scopeId
     */
    private resolveScope;
    /**
     * Returns the inline template from user or workspace settings
     * @param _id task, memo, etc.
     * @param _defaultValue
     * @param _scopeId
     */
    private getInlineTemplate;
    /**
     * Cached variant
     * @param _id
     * @param _defaultValue
     * @param _scopeId
     * @deprecated Replaced to support live reloading
     */
    private getInlineTemplateCached;
}
