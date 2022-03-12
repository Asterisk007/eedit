const { dialog } = require("electron");
import fs = require("fs");

export default class DocumentCommands {
    static open(): string {
        dialog.showOpenDialog({
            title: "Open file",
            defaultPath: "/",
            filters: [
                { name: "Text Files", extensions: ["txt"] },
                { name: "All Files", extensions: ["*"] }
            ]
        }).then(saveResult => {
            if (saveResult.canceled) {
                return "";
            } else if (saveResult.filePaths.length == 1) {
                return saveResult.filePaths[0];
            } else {
                dialog.showErrorBox("Error", "Please select a file.");
            }
        });
        return "";
    }

    static saveAs(fileText: string): string {
        dialog.showSaveDialog({
            title: "Save to...",
            defaultPath: "/",
            filters: [
                { name: "Text Files", extensions: ["txt"] },
                { name: "All Files", extensions: ["*"] }
            ]
        }).then(saveResult => {
            if (saveResult.canceled) {
                return "";
            } else if (saveResult.filePath != "") {
                this.save(saveResult.filePath, fileText);

                return saveResult.filePath;
            }
        });
        return "";
    }

    static save(filePath: string, data: string) {
        fs.writeFile(filePath, data, () => {
            console.log("Wrote to " + filePath);
        });
    }
}