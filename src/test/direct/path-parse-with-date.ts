import * as assert from 'assert';
import moment = require('moment');

const regExpDateFormats: RegExp = new RegExp(/\$\{(?:(year|month|day|localTime|localDate|weekday)|(d:[\s\S]+?))\}/g);
let base = "c:\\Users\\user\\Git\\vscode-journal\\test\\workspace\\journal";

// Test cases
const testCases = [
    {
        pathTpl: "${base}/${year}-${month}",
        fileTpl: "${year}${month}${day}",
        uri: "file:/Users/user/Git/vscode-journal/test/workspace/journal/2020-07/20200709.md"
    },
    {
        pathTpl: "${year}/${month}/${day}",
        fileTpl: "journal",
        uri: "file:/Users/user/Git/vscode-journal/test/workspace/journal/2020/07/09/journal.md"
    },
    {
        pathTpl: "${base}",
        fileTpl: "${year}-${month}-${day}",
        uri: "file:/Users/user/Git/vscode-journal/test/workspace/journal/2020-07-09.md"
    },
    {
        pathTpl: "${base}",
        fileTpl: "${d:YYYY-MM-DD}",
        uri: "file:/Users/user/Git/vscode-journal/test/workspace/journal/2020-07-09.md"
    }
];

testCases.forEach(({ pathTpl, fileTpl, uri }) => {
    console.log("Test to acquire date from uri: ", uri);
    getDateFromURI(uri, pathTpl, fileTpl, base)
        .then(result => assertCorrectDate(result))
        .catch(error => console.error("Test failed for URI:", uri, error));
});

export async function getDateFromURI(
    uri: string,
    pathTemplate: string,
    fileTemplate: string,
    basePath: string
): Promise<Date> {
    if (fileTemplate.indexOf(".") > 0) {
        fileTemplate = fileTemplate.substr(0, fileTemplate.lastIndexOf("."));
    }
    if (pathTemplate.startsWith("${base}/")) {
        pathTemplate = pathTemplate.substring("${base}/".length);
    }

    let pathParts = uri.split("/");

    // Extract path and file parts
    let pathStr = "";
    let fileStr = "";

    pathParts.forEach((element, index) => {
        if (element.trim().length === 0) return;
        if (element.startsWith("file:")) return;
        if (basePath.search(element) >= 0) return;

        if (index + 1 === pathParts.length) {
            fileStr = element.substr(0, element.lastIndexOf(".")) || element;
        } else {
            pathStr += pathStr.length > 0 ? "/" : "";
            pathStr += element;
        }
    });

    console.log("Path string:", pathStr);
    console.log("File string:", fileStr);

    // Convert templates to moment formats
    const entryMomentTpl = replaceDateTemplatesWithMomentsFormats(fileTemplate);
    const pathMomentTpl = replaceDateTemplatesWithMomentsFormats(pathTemplate);

    let parsedFile = moment(fileStr, entryMomentTpl, true); // Strict parsing
    let parsedPath = moment(pathStr, pathMomentTpl, true); // Strict parsing

    console.log("Parsed file string:", parsedFile.isValid() ? parsedFile.format() : "Invalid date");
    console.log("Parsed path string:", parsedPath.isValid() ? parsedPath.format() : "Invalid date");

    if (!parsedFile.isValid() && !parsedPath.isValid()) {
        throw new Error("Both file and path parsing failed for URI: " + uri);
    }

    // Consolidate date values
    let result = moment();

    if (parsedFile.isValid()) {
        result = result.year(parsedFile.year()).month(parsedFile.month()).date(parsedFile.date());
    } else if (parsedPath.isValid()) {
        result = result.year(parsedPath.year()).month(parsedPath.month()).date(parsedPath.date());
    }

    return result.toDate();
}

export function replaceDateTemplatesWithMomentsFormats(template: string): string {
    let matches: RegExpMatchArray | null = template.match(regExpDateFormats);
    if (matches === null) {
        return template;
    }

    matches.forEach(match => {
        switch (match) {
            case "${year}":
                template = template.replace(match, "YYYY");
                break;
            case "${month}":
                template = template.replace(match, "MM");
                break;
            case "${day}":
                template = template.replace(match, "DD");
                break;
            case "${localTime}":
                template = template.replace(match, "LT");
                break;
            case "${localDate}":
                template = template.replace(match, "LL");
                break;
            case "${weekday}":
                template = template.replace(match, "dddd");
                break;
            default:
                if (match.startsWith("${d:")) {
                    let modifier = match.substring(match.indexOf("d:") + 2, match.length - 1);
                    template = template.replace(match, modifier);
                }
                break;
        }
    });

    return template;
}

function assertCorrectDate(date: Date): void {
    if (isNaN(date.getTime())) {
        console.error("Invalid date received:", date);
        throw new Error("Invalid Date object");
    }

    let iso = date.toISOString();
    let result = iso.substring(0, iso.indexOf("T"));
    console.log("Parsed result is: ", result);
    assert.match(result, /2020-07-09/, "Date does not match expected value");
}