"use strict";

import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { overlayWindow } from '../'

const log = require("electron-log");
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    fullscreen: true,
    webPreferences: {
    	nodeIntegration: true,
		enableRemoteModule: true
    },
	...overlayWindow.WINDOW_OPTS
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.disableHardwareAcceleration();

app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdates();
});

app.on("window-all-closed", () => {
  console.log(process.platform);
  if (process.platform !== "linux") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
  autoUpdater.quitAndInstall();
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
