import { Disposable } from "vscode";

export interface IRegister {
  registerAll(): Disposable[];
}
