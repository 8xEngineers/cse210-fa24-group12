import { ExtensionContext, Memento } from "vscode";
import TagDataProvider from "../../src/data-providers/TagDataProvider";

describe("TagDataProvider Tests", () => {
  let mockContext: Partial<ExtensionContext>;
  let provider: TagDataProvider;

  beforeEach(() => {
    mockContext = {
      workspaceState: {
        get: jest.fn(() => [{ tag: "urgent" }]),
        update: jest.fn(),
        keys: jest.fn(() => []),
      } as Memento, // Explicitly cast to Memento
    };
    provider = new TagDataProvider(mockContext as ExtensionContext);
  });

  test("Should fetch tags from workspace", () => {
    const tags = provider.getChildren();
    expect(tags).toHaveLength(1);
    expect(tags[0].tag).toBe("urgent");
  });
});
