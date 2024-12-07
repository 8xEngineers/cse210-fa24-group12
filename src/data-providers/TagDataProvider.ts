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
  private _onDidChangeTreeData: EventEmitter<Tag | undefined> = new EventEmitter<Tag | undefined>();
  readonly onDidChangeTreeData: Event<Tag | undefined> = this._onDidChangeTreeData.event;

  private journalEntries: Map<string, TreeItem[]> = new Map(); // Store journal entries
  private visibleEntries: Set<string> = new Set(); // Track visible entries for filtering

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  // Refresh the tree view
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  // Get a tree item for a given tag or journal entry
  getTreeItem(element: Tag): TreeItem {
    return element;
  }

  // Get children for a tree item (tags or journal entries)
  getChildren(element?: Tag): Promise<Tag[]> {
    if (element) {
      const taggedFiles = this.context.workspaceState.get<string[]>(element.tag);
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

  // Add a journal entry to the provider
  addJournalEntry(rootFolder: string, filePath: string): void {
    const relativePath = filePath.replace(rootFolder, "").replace(/\\/g, "/");
    const parts = relativePath.split("/");
    let parent = this.journalEntries;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        const item = new TreeItem(part, TreeItemCollapsibleState.None);
        item.command = {
          command: "vscode.open",
          title: "Open File",
          arguments: [filePath]
        };
        (parent.get(part) || []).push(item);
      } else {
        if (!parent.has(part)) {
          parent.set(part, []);
        }
        parent = parent.get(part)!;
      }
    });
  }

  // Clear all journal entries
  clear(): void {
    this.journalEntries.clear();
    this.visibleEntries.clear();
    this.refresh();
  }

  // Set visibility for all entries
  setAllVisible(visible: boolean): void {
    if (visible) {
      this.visibleEntries.clear();
    } else {
      this.visibleEntries = new Set(this.journalEntries.keys());
    }
    this.refresh();
  }

  // Set visibility for a specific entry
  setVisible(rootFolder: string, filePath: string): void {
    const relativePath = filePath.replace(rootFolder, "").replace(/\\/g, "/");
    this.visibleEntries.add(relativePath);
    this.refresh();
  }

  // Search for a term in journal entries
  search(term: string): void {
    const regex = new RegExp(term, "gi");
    this.visibleEntries.clear();

    for (const [key, value] of this.journalEntries.entries()) {
      if (regex.test(key)) {
        this.visibleEntries.add(key);
      }
      value.forEach(item => {
        if (regex.test(item.label || "")) {
          this.visibleEntries.add(key);
        }
      });
    }
    this.refresh();
  }

  // Expand all nodes in the tree view
  expandAll(): void {
    console.log("Expand all logic can be implemented here.");
    // Implement expand logic if needed
  }

  // Collapse all nodes in the tree view
  collapseAll(): void {
    console.log("Collapse all logic can be implemented here.");
    // Implement collapse logic if needed
  }
}

// Helper function to get tags from workspace state
function getTags(context: ExtensionContext): Tag[] {
  const tags = context.workspaceState.get<string[]>(TAGS_KEY);
  return (
    tags?.map((t: string) => {
      const taggedFiles = context.workspaceState.get<string[]>(t);
      return new Tag(
        t,
        TreeItemCollapsibleState.Collapsed,
        undefined,
        taggedFiles?.length || 0,
      );
    }) || []
  );
}

export default TagDataProvider;