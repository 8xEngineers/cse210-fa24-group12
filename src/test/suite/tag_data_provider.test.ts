import * as assert from 'assert';
import { ExtensionContext, Memento, TreeItemCollapsibleState } from "vscode";
import TagDataProvider from "../../data-providers/TagDataProvider";
import { suite, test, beforeEach } from 'mocha';
import { TAGS_KEY } from "../../commands/TagFile";
import Tag from "../../models/Tag";

suite("Tag Data Provider Tests", () => {
  let mockContext: Partial<ExtensionContext>;
  let provider: TagDataProvider;

  beforeEach(() => {
    mockContext = {
      workspaceState: {
        get: (key: string) => {
          // Return array of tags when TAGS_KEY is requested
          if (key === TAGS_KEY) {
            return ["urgent"];
          }
          // Return empty array for specific tag's files
          if (key === "urgent") {
            return [];
          }
          return undefined;
        },
        update: () => Promise.resolve(),
        keys: () => []
      } as Memento
    };
    provider = new TagDataProvider(mockContext as ExtensionContext);
  });

  test("Fetch tags from workspace", async () => {
    const tags = await provider.getChildren();
    
    assert.strictEqual(tags.length, 1, "Should have one tag");
    assert.ok(tags[0] instanceof Tag, "Should be a Tag instance");
    assert.strictEqual(tags[0].label, "urgent", "Tag label should be 'urgent'");
    assert.strictEqual(tags[0].collapsibleState, TreeItemCollapsibleState.Collapsed, "Tag should be collapsible");
  });
});