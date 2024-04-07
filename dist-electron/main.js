"use strict";
const electron = require("electron");
const path = require("node:path");
const child_process = require("child_process");
const DIST = path.join(__dirname, "../dist");
const VITE_PUBLIC = electron.app.isPackaged ? DIST : path.join(DIST, "../public");
process.env.DIST = DIST;
process.env.VITE_PUBLIC = VITE_PUBLIC;
electron.ipcMain.on("trigger-shortcut", (event, shortcut) => {
  const executablePath = path.join(__dirname, "shortcut1.exe");
  const command = `"${executablePath}" "${shortcut}"`;
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
/* electron.ipcMain.on("toggle-alwaysOnTop", () => {
  let currentWindow = electron.BrowserWindow.getFocusedWindow();
  currentWindow == null ? void 0 : currentWindow.setAlwaysOnTop(!currentWindow.isAlwaysOnTop);
}); */
let win = null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new electron.BrowserWindow({
    // app will launch always on top by default
    alwaysOnTop: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(createWindow);
