import * as assert from 'assert';
import { ExtensionContext, Memento } from "vscode";
import TagFileCommand from "../../commands/TagFile";
import { suite, test, beforeEach } from 'mocha';
import proxyquire from 'proxyquire';

suite("Tag File Command Tests", () => {
  let mockContext: ExtensionContext;
  let TagFileCommandWithMock: any;

  beforeEach(() => {
    let updateCalls: string[][] = [];
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