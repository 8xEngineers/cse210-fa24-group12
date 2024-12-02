import { commands, ExtensionContext, Uri, Disposable, workspace, window } from "vscode";

import TagDataProvider from "./data-providers/TagDataProvider";
import JournalViewDataProvider from "./data-providers/JournalViewDataProvider";
import TagFileCommand from "./commands/TagFile";
import OpenTaggedFileCommand from "./commands/OpenTaggedFile";
import UntagFileCommand from "./commands/UntagFile";
import DeleteTagAndUntagFilesCommand from "./commands/DeleteTagAndUntagFiles";
import Tag from "./models/Tag";
import { IRegister } from "./interfaces/IRegister";
import RevealToday from "./commands/RevealToday";


class RegisterCommands implements IRegister {
  private context: ExtensionContext;
  private tagDataProvider: TagDataProvider;
  private journalViewDataProvider: JournalViewDataProvider;

  constructor(context: ExtensionContext, tagDataProvider: TagDataProvider, journalViewDataPprovider: JournalViewDataProvider) {
    this.context = context;
    this.tagDataProvider = tagDataProvider;
    this.journalViewDataProvider = journalViewDataPprovider;
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
      ),

      commands.registerCommand('journalViewExplorer.refresh', () => {
          this.journalViewDataProvider.refresh();
      }),

      commands.registerCommand(
        "journalViewExplorer.today",
        async () => {
          const command = new RevealToday(false, this.context, this.journalViewDataProvider);
          commands.executeCommand( "journal.today" ).then( async function()
          {
            await command.execute();
          });
          this.journalViewDataProvider.refresh();
        }
      ),

    

      //   context.subscriptions.push( vscode.commands.registerCommand( 'vscode-journal-view.todayInExplorer', function()
      //   {
      //       revealButtonPressed( true );
      //   } ) );

      //   context.subscriptions.push( vscode.commands.registerCommand( 'vscode-journal-view.today', function()
      //   {
      //       revealButtonPressed( false );
      //   } ) );

      // commands.registerCommand( 'vscode-journal-view.open', ( file ) =>
      // {
      //   workspace.openTextDocument( file ).then( function( document ) {
      //     window.showTextDocument( document ).then( function( editor ) {
      //       commands.executeCommand( 'workbench.action.focusActiveEditorGroup' );
      //       // highlightSearchTerm( file !== document.fileName );
      //     });
      //   });
      // }),

      // commands.registerCommand('vscode-journal.showInExplorer', () => {
      //     this.journalViewDataProvider.revealToday(true);
      // }),
    ];

    return subscriptions;
  }
}

// function revealButtonPressed( revealInExplorer )
// { 
//     commands.executeCommand( "journal.today" ).then( function()
//     {
//         revealToday( revealInExplorer );
//     } );
// }

export default RegisterCommands;
