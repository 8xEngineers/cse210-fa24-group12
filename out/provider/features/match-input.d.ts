import { Logger } from "../../util/logger";
import { Input } from "../../model/input";
/**
 * Feature responsible for parsing the user input and and extracting offset, flags and text.
 */
export declare class MatchInput {
    logger: Logger;
    locale: string;
    today: Date;
    private scopeExpression;
    private expr;
    constructor(logger: Logger, locale: string);
    /**
         * Takes a string and separates the flag, date and text
         *
         * @param {string} inputString the value to be parsed
         * @param {boolean} replaceSpecialCharacters if special characters like the # have to be normalized (e.g. for file names)
         * @returns {Q.Promise<J.Model.Input>} the resolved input object
         * @memberof Parser
         */
    parseInput(inputString: string): Promise<Input>;
    /**
     * If tags are present in the input string, extract them if these are configured scopes
     *
     * @private
     * @param {string[]} values
     * @returns {string}
     * @memberof Parser
     */
    private extractTags;
    private extractText;
    private extractFlags;
    /**
     * Tries to extract the mentioned week
     *
     *
     */
    extractWeek(inputGroups: RegExpMatchArray): number;
    resolveRelatedWeek(modifier: string): number;
    /**
     *
     * @param weekAsNumber numbered week, e.g. "w13"
     */
    resolveNumberedWeek(weekAsNumber: string): number;
    private extractOffset;
    private resolveOffsetString;
    private resolveShortcutString;
    /**
     * Resolves an ISO String and returns the offset to the current day
     *
     * @param inputString  a date formatted as iso string, e.g. 06-22
     * @returns the offset to the current day
     */
    private resolveISOString;
    /**
     * Resolves the weekday for a given string. Allowed strings are monday to friday. If a modifier is present
     * ("next" or "last"), it will return the according weekdey of last or next week.
     *
     * @param weekday the weekday as a string
     * @param mod next or last
     * @returns the offset to the current day as number
     */
    private resolveWeekday;
    /**
     * Parses strings like "Jun 1" and returns the offset from today
     *
     * @param month
     * @param dayOfMonth
     * @returns
     */
    private resolveDayOfMonth;
    /**
     * Takes any given string as input and tries to compute the offset from today's date.
     * It translates something like "next wednesday" into "4" (if next wednesday is in four days).
     *
     * @param {string} value the string to be processed
     * @returns {Q.Promise<number>}  the resolved offeset
     * @memberof Parser
     */
    private getExpression;
    private getMonthPattern;
    private getWeekdayPattern;
}
