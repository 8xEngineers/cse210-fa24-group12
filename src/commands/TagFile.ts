import { ExtensionContext } from "vscode";
import InputQuickPick from "../widgets/InputQuickPick";

export const TAGS_KEY = "tags";

class TagFileCommand {
  private args: any;
  private context: ExtensionContext;

  constructor(args: any, context: ExtensionContext) {
    this.args = args;
    this.context = context;
  }

  async execute() {
    const currentTags = this.context.workspaceState.get<string[]>(TAGS_KEY) || [];
    const value = await InputQuickPick(currentTags);

    if (!value) {
      return value;
    }

    if (value && !currentTags.includes(value)) {
      await this.context.workspaceState.update(TAGS_KEY, [
        ...currentTags,
        value
      ]);
    }

    try {
      const currentFiles =
        this.context.workspaceState.get<string[]>(value) || [];
      if (!currentFiles.includes(this.args.fsPath)) {
        await this.context.workspaceState.update(value, [
          ...currentFiles,
          this.args.fsPath
        ]);
      }
    } catch (e) {
      console.log("error", e);
    }
  }
}

export default TagFileCommand;
