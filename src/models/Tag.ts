import { workspace, TreeItem, TreeItemCollapsibleState, Command } from "vscode";

const formatPath = (path?: string) => {
  if (path && workspace.rootPath) {
    return path.replace(workspace.rootPath, ".");
  }
  return undefined;
};

class Tag extends TreeItem {
  constructor(
    public tag: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public path?: string,
    private count?: number,
    public readonly command?: Command
  ) {
    super(formatPath(path) || tag, collapsibleState);
    this.contextValue = path ? "taggedFile" : "tag";
  }

  get tagDescription(): string {
    if (this.count) {
      return `(${this.count})`;
    }
    return "";
  }
}

export default Tag;
