// Copyright (C) 2021 Patrick Maué
// 
// This file is part of vscode-journal.
// 
// vscode-journal is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// vscode-journal is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with vscode-journal.  If not, see <http://www.gnu.org/licenses/>.
// 

'use strict';

import moment from "moment";


/**
* Formats a given Date in long format (for Header in journal pages)
*/
export function formatDate(date: Date, template: string, locale: string): string {
    moment.locale(locale);
    const now = moment(date).format(template);
    return now;
}




/**
 * Utility function to match strings against patterns and return corresponding index.
 */
function matchStringToIndex(input: string, patterns: { regex: RegExp; index: number }[]): number {
    for (const { regex, index } of patterns) {
        if (input.match(regex)) {
            return index;
        }
    }
    return -1;
}

/**
 * Return day of week for given string. 
 * 
 * Update: Using momentjs to support locales (since first day of week differs internationally)
 */
export function getDayOfWeekForString(day: string, locale: string): number {
    //console.log("locale:",locale);
    const patterns = [
        { regex: /monday|mon|mo|montag|lun|lundi|lunes|lunedì|segunda-feira|seg|maandag|ma|понедельник|пн|xīngqī yī|getsuyōbi|الإثنين/i, index: 1 },
        { regex: /tuesday|tue|tu|dienstag|die|mar|mardi|martes|martedì|terça-feira|ter|dinsdag|di|вторник|вт|xīngqī èr|kayōbi|الثلاثاء/i, index: 2 },
        { regex: /wednesday|wed|we|mittwoch|mit|mer|mercredi|miércoles|mié|mercoledì|quarta-feira|qua|woensdag|woe|среда|ср|xīngqī sān|suiyōbi|الأربعاء/i, index: 3 },
        { regex: /thursday|thu|th|donnerstag|don|jeu|jeudi|jue|jueves|giovedì|quinta-feira|qui|donderdag|do|четверг|чт|xīngqī sì|mokuyōbi|الخميس/i, index: 4 },
        { regex: /friday|fri|fr|freitag|fre|ven|vendredi|vie|viernes|venerdì|sexta-feira|sex|vrijdag|vr|пятница|пт|xīngqī wǔ|kin'yōbi|الجمعة/i, index: 5 },
        { regex: /saturday|sat|sa|samstag|sam|samedi|sáb|sábado|sabato|sábado|zaterdag|za|суббота|сб|xīngqī liù|doyōbi|السبت/i, index: 6 },
        { regex: /sunday|sun|su|sonntag|dim|dimanche|dom|domingo|domenica|domingo|zondag|zo|воскресенье|вс|nichiyōbi|الأحد/i, index: 7 }
    ];
    return matchStringToIndex(day, patterns);
}

/**
 * Return month for given string. 
 * 
 * Update: Using momentjs to support locales (since first day of week differs internationally)
 */
export function getMonthForString(month: string): number {
    // Support for English, German, French, Spanish, Italian, Portuguese, Dutch, Russian, Chinese (Pinyin), Japanese (Romaji), and Arabic months
    if (month.match(/jan|january|januar|janvier|enero|gennaio|janeiro|januari|янв|январь|yīyuè|ichigatsu|يناير/i)) { return 0; }
    if (month.match(/feb|february|februar|février|febrero|febbraio|fevereiro|februari|фев|февраль|èryuè|nigatsu|فبراير/i)) { return 1; }
    if (month.match(/mar|march|märz|mars|marzo|maart|март|sānyuè|sangatsu|مارس/i)) { return 2; }
    if (month.match(/apr|april|avril|abril|aprile|april|апр|апрель|sìyuè|shigatsu|أبريل/i)) { return 3; }
    if (month.match(/may|mai|mayo|maggio|mei|май|wǔyuè|gogatsu|مايو/i)) { return 4; }
    if (month.match(/jun|june|juin|junio|giugno|junho|juni|июнь|liùyuè|rokugatsu|يونيو/i)) { return 5; }
    if (month.match(/jul|july|juli|juillet|julio|luglio|julho|июль|qīyuè|shichigatsu|يوليو/i)) { return 6; }
    if (month.match(/aug|august|août|agosto|agosto|augustus|авг|август|bāyuè|hachigatsu|أغسطس/i)) { return 7; }
    if (month.match(/sep|sept|september|septembre|septiembre|settembre|setembro|сент|сентябрь|jiǔyuè|kugatsu|سبتمبر/i)) { return 8; }
    if (month.match(/oct|october|oktober|octobre|octubre|ottobre|outubro|oktober|окт|октябрь|shíyuè|jugatsu|أكتوبر/i)) { return 9; }
    if (month.match(/nov|november|novembre|noviembre|novembro|ноя|ноябрь|shíyīyuè|juichigatsu|نوفمبر/i)) { return 10; }
    if (month.match(/dec|december|dezember|décembre|diciembre|dicembre|dezembro|декабрь|shí'èryuè|juunigatsu|ديسمبر/i)) { return 11; }

    return -1;
}


   /**
     * Checks whether any embedded expressions with date formats are in the template, and replaces them in the value using the given date. 
     * 
     * @param st
     * @param date 
     */
    const regExpDateFormats: RegExp = new RegExp(/\$\{(?:(year|month|day|localTime|localDate|weekday)|(d:[\s\S]+?))\}/g);

    export function replaceDateFormats(template: string, date: Date, locale?: string): string {
        const matches: RegExpMatchArray | null = template.match(regExpDateFormats);
        if(matches === null) {
            return template; 
        }

        const mom: moment.Moment = moment(date);
        moment.locale(locale);

        matches.forEach(match => {
            switch (match) {
                case "${year}":
                    template = template.replace(match, mom.format("YYYY")); break;
                case "${month}":
                    template = template.replace(match, mom.format("MM")); break;
                case "${day}":
                    template = template.replace(match, mom.format("DD")); break;
                case "${localTime}":
                    template = template.replace(match, mom.format("LT")); break;
                case "${localDate}":
                    template = template.replace(match, mom.format("LL")); break;
                case "${weekday}":
                    template = template.replace(match, mom.format("dddd")); break;
                case "${week}":
                    template = template.replace(match, mom.week() + ""); break;
                default:
                    // check if custom format
                    if (match.startsWith("${d:")) {
                        const modifier = match.substring(match.indexOf("d:") + 2, match.length - 1);
                        template = template.replace(match, mom.format(modifier));
                        break;
                    }
                    break;
            }
        });

        return template;
    }

    export function replaceDateTemplatesWithMomentsFormats(template: string): string {
        const matches: RegExpMatchArray | null = template.match(regExpDateFormats);
        if (matches === null) {
            return template;
        }

        matches.forEach(match => {
            switch (match) {
                case "${year}":
                    template = template.replace(match, "YYYY"); break;
                case "${month}":
                    template = template.replace(match, "MM"); break;
                case "${day}":
                    template = template.replace(match, "DD"); break;
                case "${localTime}":
                    template = template.replace(match, "LT"); break;
                case "${localDate}":
                    template = template.replace(match, "LL"); break;
                case "${weekday}":
                    template = template.replace(match, "dddd"); break;
                default:
                    // check if custom format
                    if (match.startsWith("${d:")) {
                        const modifier = match.substring(match.indexOf("d:") + 2, match.length - 1);
                        template = template.replace(match, modifier);
                        break;
                    }
                    break;
            }
        });
        return template;

    }

    /**
     * Utility function to replace date format placeholders in a template.
     */
    function replaceDatePlaceholders(template: string, mom: moment.Moment): string {
        const matches: RegExpMatchArray | null = template.match(regExpDateFormats);
        if (matches === null) {
            return template; 
        }

        matches.forEach(match => {
            switch (match) {
                case "${year}":
                    template = template.replace(match, mom.format("YYYY")); break;
                case "${month}":
                    template = template.replace(match, mom.format("MM")); break;
                case "${day}":
                    template = template.replace(match, mom.format("DD")); break;
                case "${localTime}":
                    template = template.replace(match, mom.format("LT")); break;
                case "${localDate}":
                    template = template.replace(match, mom.format("LL")); break;
                case "${weekday}":
                    template = template.replace(match, mom.format("dddd")); break;
                case "${week}":
                    template = template.replace(match, mom.week() + ""); break;
                default:
                    // check if custom format
                    if (match.startsWith("${d:")) {
                        const modifier = match.substring(match.indexOf("d:") + 2, match.length - 1);
                        template = template.replace(match, mom.format(modifier));
                        break;
                    }
                    break;
            }
        });
        return template;
    }