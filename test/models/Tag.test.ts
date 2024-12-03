import Tag from "../../src/models/Tag";
import { TreeItemCollapsibleState } from "vscode";

describe("Tag Model Tests", () => {
  test("Should create a tag with formatted path", () => {
    const tag = new Tag("urgent", TreeItemCollapsibleState.Collapsed, "/workspace/file.txt");
    expect(tag.path).toBe("./file.txt");
  });

  test("Should handle undefined path gracefully", () => {
    const tag = new Tag("urgent", TreeItemCollapsibleState.None);
    expect(tag.path).toBeUndefined();
  });
});
