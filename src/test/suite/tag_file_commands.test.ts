import * as assert from 'assert';
import { ExtensionContext, Memento, TreeItemCollapsibleState, window, Uri } from "vscode";
import TagFileCommand from "../../commands/TagFile";
import UntagFile from '../../commands/UntagFile';
import OpenTaggedFileCommand from '../../commands/OpenTaggedFile';
import DeleteTagAndUntagFiles from '../../commands/DeleteTagAndUntagFiles';
import RenameTagCommand from '../../commands/RenameTag';
import { suite, test, beforeEach, afterEach } from 'mocha';
import proxyquire from 'proxyquire';
import Tag from "../../models/Tag";
import sinon from 'sinon';
import { TAGS_KEY } from "../../commands/TagFile";

suite("Tag File Command Tests", () => {
  let mockContext: ExtensionContext;
  let TagFileCommandWithMock: any;

  beforeEach(() => {
    const updateCalls: string[][] = [];
    mockContext = {
      workspaceState: {
        get: () => [],
        update: (key: string, value: string[]) => {
          updateCalls.push([key, ...value]);
          return Promise.resolve();
        },
        keys: () => []
      } as Memento,
    } as ExtensionContext;

    // Add a way to verify the calls
    (mockContext.workspaceState as any).getUpdateCalls = () => updateCalls;

    // Mock InputQuickPick using proxyquire
    TagFileCommandWithMock = proxyquire('../../commands/TagFile', {
      '../widgets/InputQuickPick': {
        default: () => Promise.resolve("urgent")
      }
    }).default;
  });

  test("Add a new tag", async () => {
    const command = new TagFileCommandWithMock({fsPath: "/test/file.txt"}, mockContext);
    await command.execute();

    const updateCalls = (mockContext.workspaceState as any).getUpdateCalls();
    assert.strictEqual(updateCalls.length, 2, "Update should be called twice");
    // assert.deepStrictEqual(updateCalls[0], ["tags", "urgent"], "Should update with correct tag");
    // assert.strictEqual(updateCalls.length, 2, "Should have two updates");
        
    // Check first update: adding to tags list
    assert.deepStrictEqual(updateCalls[0], ["tags", "urgent"]);
    
    // Check second update: associating file with tag
    assert.deepStrictEqual(updateCalls[1], ["urgent", "/test/file.txt"]);
  });

  test("Handle duplicate tags gracefully", async () => {
    mockContext.workspaceState.get = (key: string) => {
        // Return existing tags when checking TAGS_KEY
        if (key === "tags") {
            return ["urgent"];
        }
        // Return empty array for other keys (file associations)
        return [];
    };
    
    const command = new TagFileCommandWithMock({ fsPath: "/test/file.txt" }, mockContext);
    await command.execute();

    const updateCalls = (mockContext.workspaceState as any).getUpdateCalls();
    assert.strictEqual(updateCalls.length, 1, "Should only be called once for file association");
  });
});

suite("Untag File Command Tests", () => {
  let mockContext: ExtensionContext;
  let updateCalls: [string, string[]][];

  beforeEach(() => {
    updateCalls = [];
    mockContext = {
      workspaceState: {
        get: (key: string) => {
          // Simulate existing tagged files
          if (key === "testTag") {
            return ["/test/file1.txt", "/test/file2.txt"];
          }
          return [];
        },
        update: (key: string, value: string[]) => {
          updateCalls.push([key, value]);
          return Promise.resolve();
        },
        keys: () => []
      } as Memento,
    } as ExtensionContext;
  });

  test("Remove file from tag's file list", async () => {
    const tag = new Tag("testTag", TreeItemCollapsibleState.Collapsed, "/test/file1.txt");
    const command = new UntagFile(tag, mockContext);
    await command.execute();

    assert.strictEqual(updateCalls.length, 1, "Update should be called once");
    assert.deepStrictEqual(
      updateCalls[0],
      ["testTag", ["/test/file2.txt"]],
      "Should remove only the specified file"
    );
  });

  test("Handle removing non-existent file from tag", async () => {
    const tag = new Tag("testTag", TreeItemCollapsibleState.Collapsed, "/test/nonexistent.txt");
    const command = new UntagFile(tag, mockContext);
    await command.execute();

    assert.strictEqual(updateCalls.length, 1, "Update should still be called");
    assert.deepStrictEqual(
      updateCalls[0],
      ["testTag", ["/test/file1.txt", "/test/file2.txt"]],
      "Should keep existing files unchanged"
    );
  });

  test("Handle empty tagged files list", async () => {
    // Override the get method to return null/undefined
    mockContext.workspaceState.get = () => undefined;
    
    const tag = new Tag("testTag",TreeItemCollapsibleState.Collapsed, "/test/file1.txt");
    const command = new UntagFile(tag, mockContext);
    await command.execute();

    assert.strictEqual(updateCalls.length, 1, "Update should be called");
    assert.deepStrictEqual(
      updateCalls[0],
      ["testTag", undefined],
      "Should handle undefined gracefully"
    );
  });
});

suite("Open Tagged File Command Tests", () => {
  let showTextDocumentStub: sinon.SinonStub;

  beforeEach(() => {
    // Create a stub for the showTextDocument method
    showTextDocumentStub = sinon.stub(window, 'showTextDocument').resolves();
  });

  afterEach(() => {
    // Restore the original method after each test
    showTextDocumentStub.restore();
  });

  test("Open file in editor", async () => {
    // Create a test file path
    const testFilePath = "/test/path/file.txt";
    
    // Create and execute the command
    const command = new OpenTaggedFileCommand(testFilePath);
    await command.execute();

    // Verify that showTextDocument was called with the correct Uri
    assert.strictEqual(
      showTextDocumentStub.calledOnce, 
      true, 
      "showTextDocument should be called exactly once"
    );
    assert.strictEqual(
      showTextDocumentStub.firstCall.args[0].fsPath.replace(/\\/g, '/'), 
      testFilePath, 
      "showTextDocument should be called with the correct Uri"
    );
  });

  test("Handle file path with spaces", async () => {
    const testFilePath = "/test/path/file with spaces.txt"
    const command = new OpenTaggedFileCommand(testFilePath);
    await command.execute();

    assert.strictEqual(showTextDocumentStub.calledOnce, true);
    assert.strictEqual(showTextDocumentStub.firstCall.args[0].fsPath.replace(/\\/g, '/'), testFilePath);
  });
});

suite("Delete Tag And Untag Files Command Tests", () => {
  let mockContext: ExtensionContext;
  let updateCalls: [string, any][];
  let showInfoMessageStub: sinon.SinonStub;

  beforeEach(() => {
    updateCalls = [];
    mockContext = {
      workspaceState: {
        get: (key: string) => {
          if (key === TAGS_KEY) {
            return ["urgent", "review", "bug"];
          }
          if (key === "urgent") {
            return ["/test/file1.txt", "/test/file2.txt"];
          }
          return [];
        },
        update: (key: string, value: any) => {
          updateCalls.push([key, value]);
          return Promise.resolve();
        },
        keys: () => []
      } as Memento,
    } as ExtensionContext;

    // Stub the window.showInformationMessage
    showInfoMessageStub = sinon.stub(window, 'showInformationMessage');
  });

  afterEach(() => {
    showInfoMessageStub.restore();
  });

  test("Delete tag and untag files", async () => {
    const tag = new Tag("urgent", TreeItemCollapsibleState.Collapsed, "/test/file1.txt");
    const command = new DeleteTagAndUntagFiles(tag, mockContext);
    await command.execute();

    // Verify updates were called correctly
    assert.strictEqual(updateCalls.length, 2, "Should make two updates");
    
    // Check first update: clearing tagged files
    assert.deepStrictEqual(
      updateCalls[0], 
      ["urgent", []], 
      "Should clear the list of tagged files"
    );
    
    // Check second update: removing tag from tags list
    assert.deepStrictEqual(
      updateCalls[1], 
      [TAGS_KEY, ["review", "bug"]], 
      "Should remove tag from tags list"
    );

    // Verify information message
    assert.strictEqual(
      showInfoMessageStub.calledOnce, 
      true, 
      "Should show information message"
    );
    assert.strictEqual(
      showInfoMessageStub.firstCall.args[0],
      "Deleted tag urgent and untagged 2 files",
      "Should show correct message"
    );
  });

  test("Handle deleting non-existent tag", async () => {
    const tag = new Tag("nonexistent", TreeItemCollapsibleState.Collapsed, "/test/file1.txt");
    const command = new DeleteTagAndUntagFiles(tag, mockContext);
    await command.execute();

    assert.strictEqual(updateCalls.length, 2, "Should still make two updates");
    assert.deepStrictEqual(updateCalls[0], ["nonexistent", []]);
    assert.deepStrictEqual(
      updateCalls[1], 
      [TAGS_KEY, ["urgent", "review", "bug"]], 
      "Tags list should remain unchanged"
    );
  });

  test("Handle empty tags list", async () => {
    // Override get method to return empty/undefined tags
    mockContext.workspaceState.get = () => undefined;

    const tag = new Tag("urgent", TreeItemCollapsibleState.Collapsed, "/test/file1.txt");
    const command = new DeleteTagAndUntagFiles(tag, mockContext);
    await command.execute();

    assert.strictEqual(updateCalls.length, 2, "Should make two updates");
    assert.deepStrictEqual(updateCalls[0], ["urgent", []]);
    assert.deepStrictEqual(updateCalls[1], [TAGS_KEY, []]);
  });

});


suite("Rename Tag Command Tests", () => {
  let mockContext: ExtensionContext;
  let updateCalls: [string, any][];
  let showInputBoxStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let showInfoMessageStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    updateCalls = [];
    mockContext = {
      workspaceState: {
        get: (key: string) => {
          if (key === TAGS_KEY) {
            return ["urgent", "review", "bug"];
          }
          if (key === "urgent") {
            return ["/test/file1.txt", "/test/file2.txt"];
          }
          return [];
        },
        update: (key: string, value: any) => {
          updateCalls.push([key, value]);
          return Promise.resolve();
        },
        keys: () => []
      } as Memento,
    } as ExtensionContext;

    // Stub VS Code window methods
    showInputBoxStub = sinon.stub(window, 'showInputBox');
    showErrorMessageStub = sinon.stub(window, 'showErrorMessage');
    showInfoMessageStub = sinon.stub(window, 'showInformationMessage');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    showInputBoxStub.restore();
    showErrorMessageStub.restore();
    showInfoMessageStub.restore();
    consoleErrorStub.restore();
  });

  test("Rename a tag", async () => {
    showInputBoxStub.resolves("important");
    
    const command = new RenameTagCommand(mockContext);
    await command.execute("urgent");

    // Verify the updates
    assert.strictEqual(updateCalls.length, 3, "Should make three updates");
    
    // Check new tag was created with old files
    assert.deepStrictEqual(
      updateCalls[0], 
      ["important", ["/test/file1.txt", "/test/file2.txt"]], 
      "Should create new tag with old files"
    );
    
    // Check old tag was removed
    assert.deepStrictEqual(
      updateCalls[1], 
      ["urgent", undefined], 
      "Should remove old tag"
    );
    
    // Check tags list was updated
    assert.deepStrictEqual(
      updateCalls[2], 
      [TAGS_KEY, ["review", "bug", "important"]], 
      "Should update tags list"
    );

    // Verify success message
    assert.strictEqual(
      showInfoMessageStub.calledOnceWith("Tag 'urgent' renamed to 'important'."), 
      true
    );
  });

  test("Handle user cancellation", async () => {
    showInputBoxStub.resolves(undefined);
    
    const command = new RenameTagCommand(mockContext);
    await command.execute("urgent");

    assert.strictEqual(updateCalls.length, 0, "Should not make any updates");
    assert.strictEqual(showErrorMessageStub.called, false, "Should not show error");
    assert.strictEqual(showInfoMessageStub.called, false, "Should not show info");
  });

  test("Validate new tag name", async () => {
    // Set up input box to simulate validation
    showInputBoxStub.callsFake(async (options: any) => {
      const emptyResult = options.validateInput("");
      assert.strictEqual(emptyResult, "Tag name cannot be empty.");

      const existingResult = options.validateInput("review");
      assert.strictEqual(existingResult, "A tag with this name already exists.");

      const validResult = options.validateInput("important");
      assert.strictEqual(validResult, null);

      return "important";
    });

    const command = new RenameTagCommand(mockContext);
    await command.execute("urgent");
  });
});