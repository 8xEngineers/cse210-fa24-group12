import { window, ExtensionContext } from "vscode";

import Tag from "../models/Tag";
import { TAGS_KEY } from "./TagFile";

class DeleteTagAndUntagFiles {
  private tag: Tag;
  private context: ExtensionContext;

  constructor(tag: Tag, context: ExtensionContext) {
    this.tag = tag;
    this.context = context;
  }

  async execute() {
    try {
      const currentTags =
        this.context.workspaceState.get<string[]>(TAGS_KEY) || [];
      const filteredTags = currentTags.filter(t => t !== this.tag.tag);
      const taggedFiles =
        this.context.workspaceState.get<string[]>(this.tag.tag) || [];

      await this.context.workspaceState.update(this.tag.tag, []);
      await this.context.workspaceState.update(TAGS_KEY, filteredTags);
      window.showInformationMessage(
        `Deleted tag ${this.tag.tag} and untagged ${taggedFiles.length} files`
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export default DeleteTagAndUntagFiles;
