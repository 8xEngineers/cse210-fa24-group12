import {
  ExtensionContext,
  TreeDataProvider,
  TreeItem,
  Event,
  TreeItemCollapsibleState,
  EventEmitter
} from "vscode";

import Tag from "../models/Tag";
import { TAGS_KEY } from "../commands/TagFile";

class TagDataProvider implements TreeDataProvider<Tag> {
  context: ExtensionContext;
  private _onDidChangeTreeData: EventEmitter<
    Tag | undefined
  > = new EventEmitter<Tag | undefined>();
  readonly onDidChangeTreeData: Event<Tag | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: Tag): TreeItem {
    return element;
  }

  getChildren(element?: Tag): Promise<Tag[]> {
    if (element) {
      const taggedFiles = this.context.workspaceState.get<string[]>(
        element.tag
      );
      const mapped = taggedFiles?.map(f => {
        return new Tag(
          element.tag,
          TreeItemCollapsibleState.None,
          f,
          undefined,
          {
            command: "extension.OpenTaggedFile",
            title: "",
            arguments: [{ path: f }]
          }
        );
      });
      return Promise.resolve(mapped ?? []);
    }
    return Promise.resolve(getTags(this.context));
  }
}

function getTags(context: ExtensionContext): Tag[] {
  const tags = context.workspaceState.get<string[]>(TAGS_KEY);
  return (
    tags?.map((t: string) => {
      const taggedFiles = context.workspaceState.get<string[]>(t);
      return new Tag(
        t,
        TreeItemCollapsibleState.Collapsed,
        undefined,
        taggedFiles?.length || 0
      );
    }) || []
  );
}

export default TagDataProvider;
