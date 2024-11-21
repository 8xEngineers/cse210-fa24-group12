import { ExtensionContext } from "vscode";
import Tag from "../models/Tag";

class UntagFile {
  private tag: Tag;
  private context: ExtensionContext;

  constructor(tag: Tag, context: ExtensionContext) {
    this.tag = tag;
    this.context = context;
  }

  async execute() {
    const taggedFiles = this.context.workspaceState.get<string[]>(this.tag.tag);
    const filteredFiles = taggedFiles?.filter(f => f !== this.tag.path);
    await this.context.workspaceState.update(this.tag.tag, filteredFiles);
  }
}

export default UntagFile;
