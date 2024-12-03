import { window, Uri } from "vscode";

class OpenTaggedFileCommand {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async execute() {
    try {
      // Convert the file path to a Uri
      const fileUri = Uri.file(this.filename);
      await window.showTextDocument(fileUri);
    } catch (error) {
      // Show an error message if the file cannot be opened
      window.showErrorMessage(`Failed to open file: ${this.filename}`);
      console.error("Error opening file:", error);
    }
  }
}

export default OpenTaggedFileCommand;