"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
class onTopEmitter extends EventTarget {
  constructor() {
    super(...arguments);
    __publicField(this, "onToggle");
    __publicField(this, "onChangeOnTop");
    //public toggled: boolean = false
    __publicField(this, "_toggled", new Event("complete"));
  }
}
const alwaysOnTopEmitter = new onTopEmitter();
alwaysOnTopEmitter.onToggle = () => {
  console.log("alwaysOnTop toggled");
  alwaysOnTopEmitter.dispatchEvent(alwaysOnTopEmitter._toggled);
};
function setOnTop() {
  let win2 = electron.BrowserWindow.getFocusedWindow();
  win2 == null ? void 0 : win2.setAlwaysOnTop(!win2.isAlwaysOnTop);
}
const onTopCompleteHandler = () => {
  console.log("on top handler running");
  setOnTop();
};
alwaysOnTopEmitter.addEventListener("complete", onTopCompleteHandler);
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
const main = { alwaysOnTopEmitter, typeof: electron.BrowserWindow };
module.exports = main;
