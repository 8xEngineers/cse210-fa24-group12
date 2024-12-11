# VS Code Extension Usage Guide

This Visual Studio Code (VS Code) extension enhances your development workflow by providing [specific functionalities]. Follow the steps below to install and utilize the extension effectively.

## Installation and Setup

### 1. **Install Visual Studio Code**:

Ensure that you have VS Code installed on your system. You can download it from the [official website](https://code.visualstudio.com/).

---

### 2. **Clone the Repository**:

   git clone https://github.com/8xEngineers/cse210-fa24-group12.git
   

---

### 3. **Navigate to the Cloned Directory**:

    
    cd cse210-fa24-group12
    

---

### 4. **Install Dependencies**:

    
    npm install -g @vscode/vsce
    npm install webpack
    npm install
    vsce package
    

---

### 5. **Install Resulting File in VSCode**:

    a. Open VSCode
    b. Open the Extensions view (`Ctrl+Shift+X`)
    c. Click the `...` button and select `Install from VSIX...`
    d. Alternately, press `Ctrl+Shift+P (Cmd+Shift+P on macOS)` and select `Extensions: Install from VSIX...`
    e. Select the `.vsix` file

---

### 6. **Build the Extension**:

    
    npm run compile
    

---

### 7. **Launch the Extension**:

    Press `F5` to open a new VS Code window with the extension loaded.

## Issues

### 1. If you face version not supported issues, please change the VSCode version in package.json to corresponding version
### 2. If you see that `vsce: command`

## Features and Usage

### 1. **Daily Journal File Creation**
- Automatically creates a new journal file for the current date.
- **How to Use**:
  1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
  2. Run the command `Journal: Open Today's Journal`.
  3. A new journal file is created if it doesn’t already exist.

---

### 2. **Customizable File Locations**
- Choose where journal files are stored within your project or workspace.
- **How to Use**:
  1. Open the VS Code settings (`File > Preferences > Settings` or `Code > Preferences > Settings` on macOS).
  2. Search for `Journal Directory`.
  3. Specify your preferred directory for journal files.

---

### 3. **Customizable Date Format**
- Use custom date formats for journal file names.
- **How to Use**:
  1. Go to settings.
  2. Search for `Journal Date Format`.
  3. Define your preferred date format (e.g., `YYYY-MM-DD`).

---

### 4. **Simple and Minimalistic**
- Focused on plain text journaling with minimal distractions.
- **How to Use**:
  - Open your journal files and start writing. No additional configuration is needed for a distraction-free experience.

---

### 5. **Embedded Journal Viewer**
- Provides a side-panel view for browsing and managing journal entries.
- **How to Use**:
  1. Run the command `Journal: Open Journal View` from the command palette.
  2. Browse your journal entries directly from the side panel.

---

### 6. **Date-Based Navigation**
- Quickly navigate to previous or next journal entries by date.
- **How to Use**:
  1. Open the Journal View panel.
  2. Use the "Previous Entry" and "Next Entry" buttons to navigate through your journal.

---

### 7. **Markdown Support**
- Displays journal entries with basic markdown rendering.
- **How to Use**:
  - Open a journal file to view markdown rendering. Use markdown syntax while writing for better readability.

---

### 8. **Customizable Key Bindings**
- Define shortcuts for common actions like opening, creating, or navigating entries.
- **How to Use**:
  1. Open the command palette and search for `Keyboard Shortcuts`.
  2. Search for commands related to "Journal" and assign your preferred shortcuts.

---

### 9. **Redirectable File-Tagging Explorer Menu**
- Clickable tags in the menu redirect to files with those tags.
- **How to Use**:
  1. Tag journal entries with specific keywords (e.g., `#project`).
  2. Use the Journal View panel to click on tags and open associated files.

---

### 10. **Renamable Tags**
- Rename tags for file-tagging to improve organization.
- **How to Use**:
  1. Open the Journal View panel.
  2. Right-click on a tag in the explorer menu.
  3. Select "Rename Tag" and provide the new name.

---

### 11. **TODO-Adding Functionality**
- Add TODOs and view tasks directly in the journal interface.
- **How to Use**:
  1. Add TODO items in your journal files using `TODO:` followed by your task.
  2. Open the Journal View panel to see a consolidated task view.
  3. Mark tasks as completed or update them as needed.


## Troubleshooting

- **Support**: For further assistance, please open an issue on the [GitHub repository](https://github.com/8xEngineers/cse210-fa24-group12/issues).

By following these steps, you can integrate this extension into your development environment and leverage its capabilities to meet your needs.