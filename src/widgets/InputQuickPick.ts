import { window } from "vscode";

function InputQuickPick(currentTags: string[]) {
  return new Promise<string>(resolve => {
    const quickPick = window.createQuickPick();
    quickPick.placeholder = "Select (or create) a Tag.";
    quickPick.canSelectMany = false;
    quickPick.items = currentTags.map((label: string) => ({ label }));

    quickPick.onDidAccept(() => {
      const selection = quickPick.activeItems[0];
      resolve(selection.label);
      quickPick.hide();
    });

    quickPick.onDidChangeValue(() => {
      if (!currentTags.includes(quickPick.value)) {
        const newItems = [quickPick.value, ...currentTags].map(label => ({
          label
        }));
        quickPick.items = newItems;
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  });
}

export default InputQuickPick;
