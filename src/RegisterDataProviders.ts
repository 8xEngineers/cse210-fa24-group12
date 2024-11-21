import { window, Disposable } from "vscode";

import TagDataProvider from "./data-providers/TagDataProvider";
import { IRegister } from "./interfaces/IRegister";

class RegisterDataProviders implements IRegister {
  private tagDataProvider: TagDataProvider;

  constructor(tagDataProvider: TagDataProvider) {
    this.tagDataProvider = tagDataProvider;
  }

  registerAll(): Disposable[] {
    const subscriptions = [
      window.registerTreeDataProvider("fileTagsExplorer", this.tagDataProvider)
    ];

    return subscriptions;
  }
}

export default RegisterDataProviders;
