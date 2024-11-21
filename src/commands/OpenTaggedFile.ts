import { window, Uri } from "vscode";

class OpenTaggedFileCommand {
  private filename: Uri;

  constructor(filename: Uri) {
    this.filename = filename;
  }

  async execute() {
    window.showTextDocument(this.filename);
  }
}

export default OpenTaggedFileCommand;
