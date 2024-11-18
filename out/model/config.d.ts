export declare enum JournalPageType {
    note = 0,
    entry = 1,
    attachement = 2
}
export interface ScopedTemplate {
    name?: string;
    scope?: string;
    template: string;
    value?: string;
}
export interface FilePattern extends ScopedTemplate {
    type: JournalPageType;
}
export interface PathTemplate extends ScopedTemplate {
    type: JournalPageType;
}
export interface HeaderTemplate extends ScopedTemplate {
}
export interface InlineTemplate extends ScopedTemplate {
    after: string;
}
