import * as J from '../..';
import { FileEntry } from '../../model';
/**
 * Feature responsible for scanning the journal and notes folders and collecting the items displayed in the picklist
*/
export declare class ScanEntries {
    ctrl: J.Util.Ctrl;
    private cache;
    constructor(ctrl: J.Util.Ctrl);
    /**
     * Sync method, not used anymore
     *
     * @param thresholdInMs
     * @param directories
     * @returns
     */
    getPreviouslyAccessedFilesSync(thresholdInMs: number, directories: J.Model.ScopeDirectory[]): Promise<J.Model.FileEntry[]>;
    /**
     * Loads previous entries. This method is async and is called in combination with the sync method (which uses the threshold)
     *
     * Will cache the results
     *
     * Update: ignore threshold
     *
     * @returns {Q.Promise<[string]>}
     * @memberof Reader
     */
    getPreviouslyAccessedFiles(thresholdInMs: number, callback: Function, picker: any, type: J.Model.JournalPageType, directories: Set<J.Model.ScopeDirectory>): Promise<void>;
    private scanDirectory;
    /**
    * Scans journal directory and scans for notes
    *
    * Update: Removed age threshold, take everything
    * Update: switched to async with readdir
    *
    * See https://medium.com/@allenhwkim/nodejs-walk-directory-f30a2d8f038f
    * @param dir
    * @param callback
    */
    private walkDir;
    private walkDirSync;
}
export declare function sortPickEntries(a: FileEntry, b: FileEntry): number;
