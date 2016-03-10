/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;

// user modules
const getMenuTemplate = require('./main/get-menu-template');

let mainWindow = null;
let counter = 0;
let breakDelay = 5000;


crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('browser-window-blur', () => {
  counter++;
  if (counter < 3) {
    mainWindow.focus();
    mainWindow.setIgnoreMouseEvents(true);
  }
});

app.on('ready', () => {
  const electronScreen = electron.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    fullscreen: true
  });
  // mainWindow = new BrowserWindow({ width: 1024, height: 728 });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  setTimeout(() => {
    mainWindow.focus();
  }, breakDelay);

  const template = getMenuTemplate(app, mainWindow, shell);
  const menu = Menu.buildFromTemplate(template);

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu);
  } else {
    mainWindow.setMenu(menu);
  }
});
