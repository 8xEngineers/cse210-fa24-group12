# Test Case Documentation
For the testing, we choose Mocha as our main testing framework for our vscode extension.
Mocha is a widely-used JavaScript testing framework that runs on Node.js and in the browser, known for its flexibility and support for asynchronous testing. It provides a simple and organized way to structure tests.

In our test, it contains three parts: Journal tests, Journal view tests, and File tagging tests.

---

# Journal Tests
### direct.ts
Unit tests the behavior of replaceDateFormats function with different input types.
Checks if placeholder in ScopedTemplate is correctly replaced with expected date formats.
Is an old test case and we can format it with assertions instead of console log checks.

### input_parser.ts
Tests the behavior of parseInput function from MatchInput class.
Checks if parser correctly identifies and extracts flags like "next" and "monday".

### path-parse-with-date.ts
Tests the behavior of extracting and parsing date information from a URI based dynamic path
Validates function behavior with different input types for pathTemplate,fileTempplate and URI.
Checks if correctly finds date inside URI based path.
Validates test result using assertion instead of logs.

### replace-variables-in-string.ts
Should be removed as the similar function is done in direct.ts script

### simple-run-command.ts
Simple Hello world file, nothing else

### directTestRunner.ts
Same as input_parser.ts file.



### index.ts
***Entry point for Mocha tests***
Utilizes Mocha which is a JS testing framework for unit and integration testing
Acts as a test runner for .test.ts files.
After running all the test scripts if there is any failure provides an error with the number of tests failed

### input.test.ts
Used assert for verifying correctness and vscode and J module to get access to VScode extensions API's.
Verifies the behavior of different data input inside the VSCode extension.
Handles the case where input string can have offset(relative time),flags(additional data),task and text.
Covers wide range of scenarios to maintain reliability and accuracy. 

### week_input.test.ts
Focuses on handling of input related to weeks like w13,w,next week
Validates that the extension can correctly handled different week input and provide correct result.

---

# Journal View Tests
### journal_view.test.ts
Focus on testing the JournalDataProvider class. The tests verify several key features: the initialization and management of journal entries in a tree structure, filtering capabilities for searching through journal entries, and the expand/collapse functionality of the tree view. Additionally, it includes edge case tests to ensure the application handles scenarios like missing directories and state persistence correctly.

---

# File Tagging Tests

### tag.test.ts
Verify the functionality of the Tag model class. Specifically, it tests two scenarios: creating a tag with a file path and ensuring it's formatted correctly, and creating a tag without a path to verify it handles the undefined case gracefully.

### tag_data_provider.test.ts

Focusing on testing for the TagDataProvider class, which manages tag-related functionality in file tagging feature. The tests specifically verify the provider's ability to fetch and handle tags from the workspace state, using a mocked ExtensionContext to simulate VS Code's workspace environment. Key aspects tested include proper tag initialization, correct tag instance creation, and appropriate collapsible state setting for tag items in the UI tree view.

### tag_file_commands.test.ts
Testing the core commands of tag management features. It covers five main command areas: adding new tags (TagFileCommand), removing tags from files (UntagFile), opening tagged files (OpenTaggedFileCommand), deleting tags completely (DeleteTagAndUntagFiles), and renaming tags (RenameTagCommand). Each test suite uses mocked VS Code contexts and sinon stubs to simulate the VS Code environment, and includes tests for both happy paths and edge cases.








