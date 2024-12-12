# Test Case Documentation

## direct.ts
Unit tests the behavior of replaceDateFormats function with different input types.
Checks if placeholder in ScopedTemplate is correctly replaced with expected date formats.
Is an old test case and we can format it with assertions instead of console log checks.

## input_parser.ts
Tests the behavior of parseInput function from MatchInput class.
Checks if parser correctly identifies and extracts flags like "next" and "monday".

## path-parse-with-date.ts
Tests the behavior of extracting and parsing date information from a URI based dynamic path
Validates function behavior with different input types for pathTemplate,fileTempplate and URI.
Checks if correctly finds date inside URI based path.
Validates test result using assertion instead of logs.

## replace-variables-in-string.ts
Should be removed as the similar function is done in direct.ts script

## simple-run-command.ts
Simple Hello world file, nothing else

## directTestRunner.ts
Same as input_parser.ts file.



## index.ts
*** Entry point for Mocha tests ***
Utilizes Mocha which is a JS testing framework for unit and integration testing
Acts as a test runner for .test.ts files.
After running all the test scripts if there is any failure provides an error with the number of tests failed

## input.test.ts
Used assert for verifying correctness and vscode and J module to get access to VScode extensions API's.
Verifies the behavior of different data input inside the VSCode extension.
Handles the case where input string can have offset(relative time),flags(additional data),task and text.
Covers wide range of scenarios to maintain reliability and accuracy. 

## week_input.test.ts
Focuses on handling of input related to weeks like w13,w,next week
Validates that the extension can correctly handled different week input and provide correct result.









