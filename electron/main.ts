import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { exec, ExecException } from 'child_process';
//import {alwaysOnTopEmitter} from '../src/pages/Settings.tsx';

const DIST = path.join(__dirname, '../dist');
const VITE_PUBLIC = app.isPackaged ? DIST : path.join(DIST, '../public');
process.env.DIST = DIST;
process.env.VITE_PUBLIC = VITE_PUBLIC;

ipcMain.on('trigger-shortcut', (event, shortcut) => {
  // Assuming `shortcutExecutor.exe` is your compiled AHK script ready to receive a shortcut parameter
  const executablePath = path.join(__dirname, 'shortcut1.exe');

  // Execute the compiled AHK executable with the shortcut argument
  const command = `"${executablePath}" "${shortcut}"`;
  exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return;
    }
    console.log(`stdout!: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});


let win: BrowserWindow | null = null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    // app will launch always on top by default
    alwaysOnTop: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

// Listener for hitting the alwaysOnTop toggle switch in Settings.tsx
ipcMain.on('trigger-toggle-on-top', () => {
  win?.setAlwaysOnTop(!win.isAlwaysOnTop());
  console.log("alwaysOnTop = ", win?.isAlwaysOnTop());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);