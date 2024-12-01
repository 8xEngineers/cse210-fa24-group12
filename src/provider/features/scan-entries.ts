import * as J from '../..';
import * as fs from 'fs';
import * as Path from 'path';
import { SCOPE_DEFAULT } from '../../ext';
import { FileEntry } from '../../models';

/**
 * Feature responsible for scanning the journal and notes folders and collecting the items displayed in the picklist
 */
export class ScanEntries {
    private cache: Map<string, J.Model.FileEntry>;

    constructor(public ctrl: J.Util.Ctrl) {
        this.cache = new Map();
    }

    /**
     * Sync method, not used anymore
     *
     * @param thresholdInMs
     * @param directories
     * @returns
     */
    public getPreviouslyAccessedFilesSync(
        thresholdInMs: number,
        directories: J.Model.ScopeDirectory[]
    ): Promise<J.Model.FileEntry[]> {
        return new Promise<J.Model.FileEntry[]>((resolve, reject) => {
            try {
                this.ctrl.logger.trace(
                    'Entering getPreviousJournalFilesSync() in actions/reader.ts'
                );

                if (this.cache.size > 0) {
                    resolve(Array.from(this.cache.values()).sort(sortPickEntries));
                    return;
                }

                directories.forEach((directory) => {
                    if (!fs.existsSync(directory.path)) {
                        this.ctrl.logger.error(
                            'Invalid configuration, base directory does not exist with path',
                            directory.path
                        );
                        return;
                    }

                    this.walkDirSync(directory.path, thresholdInMs, (entries: J.Model.FileEntry[]) => {
                        entries.forEach(entry => {
                            entry.type = J.Util.inferType(
                                Path.parse(entry.path),
                                this.ctrl.config.getFileExtension()
                            );
                            entry.scope = directory.scope;
                            this.cache.set(entry.path, entry);
                        });
                    });
                });

                resolve(Array.from(this.cache.values()));
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getPreviouslyAccessedFiles(
        thresholdInMs: number,
        callback: (entries: FileEntry[], picker: unknown, type: J.Model.JournalPageType) => void,
        picker: unknown,
        type: J.Model.JournalPageType,
        directories: Set<J.Model.ScopeDirectory>
    ): Promise<void> {
        this.ctrl.logger.trace(
            'Entering getPreviouslyAccessedFiles() in actions/reader.ts and number of directories to scan: ',
            directories.size
        );

        if (this.cache.size > 0) {
            const cachedEntries: FileEntry[] = Array.from(this.cache.values())
                .filter((fe) => fe.type === type)
                .sort(sortPickEntries);
            callback(cachedEntries, picker, type);
        }

        Array.from(directories)
            .filter((dir) => dir.scope !== SCOPE_DEFAULT)
            .forEach((dir) =>
                this.scanDirectory(thresholdInMs, callback, picker, type, dir)
            );

        Array.from(directories)
            .filter((dir) => dir.scope === SCOPE_DEFAULT)
            .forEach((dir) =>
                this.scanDirectory(thresholdInMs, callback, picker, type, dir)
            );
    }

    private async scanDirectory(
        thresholdInMs: number,
        callback: (entries: FileEntry[], picker: unknown, type: J.Model.JournalPageType) => void,
        picker: unknown,
        type: J.Model.JournalPageType,
        directory: J.Model.ScopeDirectory
    ): Promise<void> {
        if (!fs.existsSync(directory.path)) {
            this.ctrl.logger.error('Invalid configuration, base directory does not exist');
            return;
        }

        this.walkDir(directory.path, thresholdInMs, (entries: FileEntry[]) => {
            entries.forEach((fe) => {
                fe.type = J.Util.inferType(
                    Path.parse(fe.path),
                    this.ctrl.config.getFileExtension()
                );
                fe.scope = directory.scope;
                if (!this.cache.has(fe.path)) {
                    this.cache.set(fe.path, fe);
                }
            });

            callback(entries, picker, type);
        });
    }

    private async walkDir(
        dir: string,
        thresholdInMs: number,
        callback: (entries: FileEntry[]) => void
    ): Promise<void> {
        fs.readdir(dir, (err, files) => {
            if (err) {
                this.ctrl.logger.error('Error reading directory:', err);
                return;
            }

            const foundFiles: FileEntry[] = [];
            files.forEach((f) => {
                const dirPath = Path.join(dir, f);
                const stats: fs.Stats = fs.statSync(dirPath);
                if (f.startsWith('.')) return;

                if (stats.isDirectory()) {
                    this.walkDir(dirPath, thresholdInMs, callback);
                } else {
                    foundFiles.push({
                        path: Path.join(dir, f),
                        name: f,
                        updateAt: stats.mtime.getTime(),
                        accessedAt: stats.atime.getTime(),
                        createdAt: stats.birthtime.getTime(),
                    });
                }
            });

            callback(foundFiles);
        });
    }

    private async walkDirSync(
        dir: string,
        thresholdDateInMs: number,
        callback: (entries: J.Model.FileEntry[]) => void
    ): Promise<void> {
        fs.readdirSync(dir).forEach((f) => {
            if (f.startsWith('.')) return;

            const dirPath = Path.join(dir, f);
            const stats: fs.Stats = fs.statSync(dirPath);

            if (stats.atimeMs > thresholdDateInMs && stats.isDirectory()) {
                this.walkDirSync(dirPath, thresholdDateInMs, callback);
            } else if (stats.mtimeMs > thresholdDateInMs) {
                callback([
                    {
                        path: Path.join(dir, f),
                        name: f,
                        updateAt: stats.mtimeMs,
                        accessedAt: stats.atimeMs,
                        createdAt: stats.birthtimeMs,
                    },
                ]);
            }
        });
    }
}

export function sortPickEntries(a: FileEntry, b: FileEntry): number {
    return b.updateAt - a.updateAt;
}
