import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { exec, ExecException } from 'child_process';

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
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});

let win: BrowserWindow | null = null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
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
