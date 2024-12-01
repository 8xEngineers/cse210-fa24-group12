import moment from "moment";
import { ScopedTemplate } from "../../models";

const regExpDateFormats: RegExp = /\$\{(?:(year|month|day|localTime|localDate)|(d:\w+))\}/g;

export function replaceDateFormats(st: ScopedTemplate, date: Date): void {
    const matches: RegExpMatchArray | null = st.template.match(regExpDateFormats);
    if (matches === null) {
        return;
    }

    console.log(JSON.stringify(matches));

    if (matches.length === 0) {
        return;
    }

    const mom: moment.Moment = moment(date);

    matches.forEach(match => {
        switch (match) {
            case "${year}":
                st.template = st.template.replace(match, mom.format("YYYY"));
                break;
            case "${month}":
                st.template = st.template.replace(match, mom.format("MM"));
                break;
            case "${day}":
                st.template = st.template.replace(match, mom.format("DD"));
                break;
            case "${localTime}":
                st.template = st.template.replace(match, mom.format("LL"));
                break;
            case "${localDate}":
                st.template = st.template.replace(match, mom.format("LD"));
                break;
            default:
                // check if custom format
                if (match.startsWith("${d:")) {
                    const modifier = match.substring(
                        match.indexOf("d:") + 2,
                        match.length - 1
                    ); // includes } at the end
                    st.template = st.template.replace(match, mom.format(modifier));
                }
                break;
        }
    });
}

const t1: ScopedTemplate = {
    scope: "default",
    template: "${year} and ${day}  and some ${month}",
};

replaceDateFormats(t1, new Date());
console.log(t1.template);

const t2: ScopedTemplate = {
    scope: "default",
    template: "Local time ${localTime} and custom format ${d:YY} for year",
};

replaceDateFormats(t2, new Date());
console.log(t2.template);
