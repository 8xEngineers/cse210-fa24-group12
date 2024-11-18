import * as Path from 'path';
import * as J from '..';
/**
* Returns the path for a given date as string
* @deprecated
*/
export declare function getEntryPathForDate(date: Date, base: string, ext: string): Promise<string>;
export declare function getPathAsString(path: Path.ParsedPath): string;
/**
 * Tries to infer a date from a given path (taken from vscode.TextDocument)
 *
 * This function expects only paths to valid journal entries, scoped entries are ignored
 *
 * Check direct test "path-parse-with-date"
 *
 * @param entryPath
 */
export declare function getDateFromURI(uri: string, pathTemplate: string, fileTemplate: string, basePath: string): Promise<Date>;
/**
 * Tries to infer a date from a given path (taken from vscode.TextDocument)
 *
 * This function expects only paths to valid journal entries, scoped entries are ignored
 *
 * @param entryPath
 */
export declare function getDateFromURIAndConfig(entryPath: string, configCtrl: J.Extension.Configuration): Promise<Date>;
/**
 * Returns the filename of a given URI.
 * Example: "21" of uri "file://some/path/to/21.md"
 *
 * @param uri
 * @param withExtension
 * @returns
 */
export declare function getFileInURI(uri: string, withExtension?: boolean): string;
/**
 * Returns path to month folder.
 */
export declare function getPathOfMonth(date: Date, base: string): string;
/**
* Returns target for notes as string;
*/
export declare function getFilePathInDateFolder(date: Date, filename: string, base: string, ext: string): Promise<string>;
/**
*  Check if config dir exists, otherwise copy defaults from extension directory
*  We can't Q's nfcall, since those nodejs operations don't have (err,data) responses
*
*  fs.exists does only return "true", see https://github.com/petkaantonov/bluebird/issues/418
*  @param path
*/
export declare function checkIfFileIsAccessible(path: string): Promise<void>;
/**
 * Tries to infer the file type from the path by matching against the configured patterns
 * @param entry - path to entry
 * @param ext - configured standard extension
 */
export declare function inferType(entry: Path.ParsedPath, extension: string): J.Model.JournalPageType;
/**
 * Converts given path and filename into a full path.
 * @param pathname
 * @param filename
 */
export declare function resolvePath(pathname: string, filename: string): string;
