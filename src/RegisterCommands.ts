import { commands, ExtensionContext, Uri, Disposable } from "vscode";

import TagDataProvider from "./data-providers/TagDataProvider";
import TagFileCommand from "./commands/TagFile";
import OpenTaggedFileCommand from "./commands/OpenTaggedFile";
import UntagFileCommand from "./commands/UntagFile";
import DeleteTagAndUntagFilesCommand from "./commands/DeleteTagAndUntagFiles";
import Tag from "./models/Tag";
import { IRegister } from "./interfaces/IRegister";

class RegisterCommands implements IRegister {
  private context: ExtensionContext;
  private tagDataProvider: TagDataProvider;

  constructor(context: ExtensionContext, tagDataProvider: TagDataProvider) {
    this.context = context;
    this.tagDataProvider = tagDataProvider;
  }

  registerAll(): Disposable[] {
    const subscriptions = [
      commands.registerCommand("extension.TagFile", async (args: any) => {
        const command = new TagFileCommand(args, this.context);
        await command.execute();
        this.tagDataProvider.refresh();
      }),
      commands.registerCommand("fileTagsExplorer.Refresh", () => {
        this.tagDataProvider.refresh();
      }),
      commands.registerCommand("extension.OpenTaggedFile", async (tag: Tag) => {
        if (tag.path) {
          const command = new OpenTaggedFileCommand(Uri.parse(tag.path));
          await command.execute();
        }
      }),
      commands.registerCommand(
        "extension.DeleteTagFromFile",
        async (tag: Tag) => {
          const command = new UntagFileCommand(tag, this.context);
          await command.execute();
          this.tagDataProvider.refresh();
        }
      ),
      commands.registerCommand(
        "extension.DeleteTagAndUntagFiles",
        async (tag: Tag) => {
          const command = new DeleteTagAndUntagFilesCommand(tag, this.context);
          await command.execute();
          this.tagDataProvider.refresh();
        }
      )
    ];

    return subscriptions;
  }
}

export default RegisterCommands;
