import { window, Disposable } from "vscode";

import TagDataProvider from "./data-providers/TagDataProvider";
import JournalViewDataProvider from "./data-providers/JournalViewDataProvider";
import { IRegister } from "./interfaces/IRegister";

class RegisterDataProviders implements IRegister {
  private tagDataProvider: TagDataProvider;
  private journalViewDataProvider: JournalViewDataProvider;

  constructor(tagDataProvider: TagDataProvider, journalViewDataProvider: JournalViewDataProvider) {
    this.tagDataProvider = tagDataProvider;
    this.journalViewDataProvider = journalViewDataProvider;
  }

  registerAll(): Disposable[] {
    const subscriptions = [
      window.registerTreeDataProvider("fileTagsExplorer", this.tagDataProvider),
      window.registerTreeDataProvider("journalViewExplorer", this.journalViewDataProvider)
    ];

    return subscriptions;
  }
}
 
export default RegisterDataProviders;
