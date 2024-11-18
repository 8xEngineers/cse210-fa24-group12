export declare function getDayAsString(date: Date): string;
/**
* Takes a number and a leading 0 if it is only one digit, e.g. 9 -> "09"
*/
export declare function prefixZero(nr: number): string;
/**
 * Returns a normalized filename for given string. Special characters will be replaced.
 * @param input
 */
export declare function normalizeFilename(input: string): string;
/**
 * Converts a filename into its readable form (for file links)
 *
 * @param input the line to convert
 * @param ext the file extension used for notes and journal entries
 */
export declare function denormalizeFilename(input: string): string;
export declare function stringIsNotEmpty(value: string | undefined | null): boolean;
export declare function isString(object: any | string | undefined): boolean;
export declare function replaceVariableValue(key: string, value: string, template: string): string;
export declare function getNextLine(content: string): string[];
