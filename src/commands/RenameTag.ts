import { ExtensionContext, window } from "vscode";
import { TAGS_KEY } from "./TagFile";

class RenameTagCommand {
  private context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  /**
   * Executes the rename tag operation.
   * @param oldTag - The tag to be renamed.
   */
  async execute(oldTag: string) {
    // Step 1: Fetch the current list of tags
    const currentTags = this.context.workspaceState.get<string[]>(TAGS_KEY) || [];
    if (!oldTag) {
      window.showErrorMessage("No tag selected for renaming.");
      return;
    }
  
    // Step 2: Validate that the tag exists
    if (!currentTags.includes(oldTag)) {
      window.showErrorMessage(`Tag '${oldTag}' does not exist.`);
      return;
    }

    // Step 3: Prompt the user for a new tag name
    const newTag = await window.showInputBox({
      prompt: `Enter a new name for the tag '${oldTag}'`,
      validateInput: (input) => {
        if (!input.trim()) return "Tag name cannot be empty.";
        if (currentTags.includes(input.trim())) return "A tag with this name already exists.";
        return null;
      },
    });

    if (!newTag) {
      // User canceled the input box
      return;
    }

    try {
      // Step 4: Update the workspace state
      const oldTagFiles = this.context.workspaceState.get<string[]>(oldTag) || [];

      // Add the new tag with the same files and remove the old tag
      await this.context.workspaceState.update(newTag, oldTagFiles);
      await this.context.workspaceState.update(oldTag, undefined);

      // Update the global tags list
      const updatedTags = currentTags.filter((tag) => tag !== oldTag).concat(newTag);
      await this.context.workspaceState.update(TAGS_KEY, updatedTags);

      // Step 5: Notify the user of the success
      window.showInformationMessage(`Tag '${oldTag}' renamed to '${newTag}'.`);
    } catch (error) {
      console.error("Error renaming tag:", error);
      window.showErrorMessage("Failed to rename the tag. Check the console for details.");
    }
  }
}

export default RenameTagCommand;