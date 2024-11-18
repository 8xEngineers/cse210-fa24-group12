/**
* Formats a given Date in long format (for Header in journal pages)
*/
export declare function formatDate(date: Date, template: string, locale: string): string;
/**
 * Return day of week for given string.
 *
 * Update: Using momentjs to support locales (since first day of week differs internationally)
 */
export declare function getDayOfWeekForString(day: string, locale: string): number;
/**
 * Return day of week for given string.
 *
 * Update: Using momentjs to support locales (since first day of week differs internationally)
 */
export declare function getMonthForString(month: string): number;
export declare function replaceDateFormats(template: string, date: Date, locale?: string): string;
export declare function replaceDateTemplatesWithMomentsFormats(template: string): string;
