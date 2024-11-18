/**
 * Returns the description based on the code provided.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param code - The code of the description string.
 * @returns The description string.
 */
export declare function getInputDetailsTranslation(code: number): string;
/**
 * Returns the label based on the code provided.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param code - The code of the label string.
 * @returns The label string.
 */
export declare function getInputLabelTranslation(code: number): string;
/**
 * Returns the pick details based on the code provided.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param code - The code of the pick details string.
 * @returns The pick details string.
 */
export declare function getPickDetailsTranslation(code: number): string;
/**
 * Returns the task details string for a specific day.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param dayAsString - The day string (e.g., "Monday", "Tuesday").
 * @returns The task details string.
 */
export declare function getInputDetailsStringForTask(dayAsString: string): string;
/**
 * Returns the task details string for a specific week.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param weekAsNumber - The week number (e.g., "32").
 * @returns The task details string for the specified week.
 */
export declare function getInputDetailsStringForTaskInWeek(weekAsNumber: number): string;
/**
 * Returns the weekly details string for a specific week.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param week - The week number.
 * @returns The weekly details string.
 */
export declare function getInputDetailsStringForWeekly(week: number): string;
/**
 * Returns the entry details string for a specific day.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param dayAsString - The day string (e.g., "Monday", "Tuesday").
 * @returns The entry details string.
 */
export declare function getInputDetailsStringForEntry(dayAsString: string): string;
/**
 * Returns the memo details string for a specific day.
 * Always returns a fallback in English if no translation is found for the user's locale.
 *
 * @param dayAsString - The day string (e.g., "Monday", "Tuesday").
 * @returns The memo details string.
 */
export declare function getInputDetailsStringForMemo(dayAsString: string): string;
