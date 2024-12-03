import { ExtensionContext, Memento } from "vscode";
import TagFileCommand from "../../src/commands/TagFile";

describe("TagFileCommand Tests", () => {
  let mockContext: ExtensionContext;

  beforeEach(() => {
    // Fully mock `ExtensionContext` with defined `workspaceState`
    mockContext = {
      workspaceState: {
        get: jest.fn(() => []),
        update: jest.fn(),
        keys: jest.fn(() => []),
      } as Memento, // Explicitly cast to `Memento`
    } as ExtensionContext; // Cast `mockContext` as `ExtensionContext`
  });

  test("Should add a new tag", async () => {
    const command = new TagFileCommand({}, mockContext);
    const mockQuickPick = jest.fn(() => Promise.resolve("urgent"));
    jest.mock("../../src/widgets/InputQuickPick", () => mockQuickPick);

    await command.execute();

    expect(mockContext.workspaceState.update).toHaveBeenCalledWith("tags", ["urgent"]);
  });

  test("Should handle duplicate tags gracefully", async () => {
    mockContext.workspaceState.get = jest.fn(() => ["urgent"]);
    const command = new TagFileCommand({}, mockContext);
    const mockQuickPick = jest.fn(() => Promise.resolve("urgent"));
    jest.mock("../../src/widgets/InputQuickPick", () => mockQuickPick);

    await command.execute();

    expect(mockContext.workspaceState.update).not.toHaveBeenCalled();
  });
});
