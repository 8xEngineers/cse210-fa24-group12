import { window, Disposable, ExtensionContext, workspace, commands } from "vscode";

import TagDataProvider from "./data-providers/TagDataProvider";
import JournalViewDataProvider from "./data-providers/JournalViewDataProvider";
import { IRegister } from "./interfaces/IRegister";
import RefreshJournalView from "./commands/Refresh";

class RegisterDataProviders implements IRegister {
  private context: ExtensionContext;
  private tagDataProvider: TagDataProvider;
  private journalViewDataProvider: JournalViewDataProvider;

  constructor(context: ExtensionContext, tagDataProvider: TagDataProvider, journalViewDataProvider: JournalViewDataProvider) {
    this.context = context;
    this.tagDataProvider = tagDataProvider;
    this.journalViewDataProvider = journalViewDataProvider;
  }

  private setExpandCollapseButtons(): void {
    const expanded = workspace.getConfiguration('vscode-journal-view').get<boolean>('expanded', false);
    commands.executeCommand('setContext', 'journalViewExplorer-show-expand', !expanded);
    commands.executeCommand('setContext', 'executeCommand-show-collapse', expanded);
  }

  registerAll(): Disposable[] {
    const subscriptions = [
      window.registerTreeDataProvider("fileTagsExplorer", this.tagDataProvider),
      window.registerTreeDataProvider("journalViewExplorer", this.journalViewDataProvider)
    ];

    const refresher = new RefreshJournalView(this.context, this.journalViewDataProvider);
    refresher.execute();

    this.setExpandCollapseButtons();

    return subscriptions;
  }
}
 
export default RegisterDataProviders;
