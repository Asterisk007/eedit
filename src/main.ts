import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import Mousetrap = require("mousetrap");
import DocumentCommands from "./document_commands";
import process = require("process");

let filePath = process.argv[0] || "";
let fileText: string;

const appName = "E-EDIT";

let mainWindow: BrowserWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    //mainWindow.removeMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    document.getElementById("fileText").onchange = onFileTextChanged;

    Mousetrap.bind("ctrl+s", () => {
        console.log("Got save keybind");
        if (filePath == "") {
            let savedFilePath = DocumentCommands.saveAs(fileText);
            if (savedFilePath != ""){
                filePath = savedFilePath;
                mainWindow.setTitle(appName + " " + filePath);
            }
        } else {
            DocumentCommands.save(filePath, fileText);
            let title = mainWindow.getTitle();
            if (title[title.length-1] == '*') {
                mainWindow.setTitle(title.slice(0, title.length-2));
            }
        }
    });

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();

    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


function onFileTextChanged(){
    if (filePath != "") {
        mainWindow.setTitle(mainWindow.getTitle() + " *");
    }
    
    fileText = document.getElementById("fileText").innerHTML;
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
