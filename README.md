# VSCode Journal - 8x Engineers

Lightweight journal and simple notes support for Visual Studio Code

# Installation

## Installing from source
1. Clone the repository
2. Run `npm install -g @vscode/vsce`
3. Run `npm install webpack`
3. Run `npm install`
4. Run `vsce package`
5. Install the resulting `.vsix` file in VSCode
    a. Open VSCode
    b. Open the Extensions view (`Ctrl+Shift+X`)
    c. Click the `...` button and select `Install from VSIX...`
    d. Alternately, press `Ctrl+Shift+P (Cmd+Shift+P on macOS)` and select `Extensions: Install from VSIX...`
    e. Select the `.vsix` file

### Issues
1. If you face version not supported issues, please change the VSCode version in package.json to corresponding version
2. If you see that `vsce: command`  
