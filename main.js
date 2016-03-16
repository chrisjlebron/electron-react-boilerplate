/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const crashReporter = electron.crashReporter;
const shell = electron.shell;

const mainIconPath = path.join(__dirname, 'app', 'assets', 'eye-4.png');

let appIcon = null;
let restWindow = null;
let prefsWindow = null;
const disableLength = '1 hour';
let state = {
  isResting: false,
  isDisabled: false
};

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  // prevent window closing from quitting the app
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  restWindow = new BrowserWindow({
    show: false
  });
  prefsWindow = new BrowserWindow({
    width: 600,
    height: 600,
    show: false
  });
  appIcon = new Tray(mainIconPath);

  restWindow.on('closed', () => {
    restWindow = null;
  });

  prefsWindow.on('closed', () => {
    prefsWindow = null;
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Take a Rest',
      type: 'normal',
      icon: mainIconPath,
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('taking a rest...');
        state.isResting = true;
        console.log('before', state);
        setTimeout(() => {
          state.isResting = false;
          console.log('after', state);
        }, 10000);
      }
    },
    {
      label: `Disable for ${disableLength}`,
      type: 'checkbox',
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('disabling...');
        setTimeout(() => {
          thisMenuItem.checked = false;
        }, 2000);
      }
    },
    { type: 'separator' },
    {
      label: 'Preferences',
      type: 'normal',
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('opening prefs window...');
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: () => {
        restWindow.loadURL(`file://${__dirname}/app/app.html`);
        restWindow.setKiosk(true);
        restWindow.toggleDevTools();
        // prefsWindow.show();
        // prefsWindow.toggleDevTools();
      }
    },
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  appIcon.setContextMenu(contextMenu);
});


app.on('browser-window-blur', () => {
  if (state.isResting) {
    restWindow.focus();
    restWindow.setIgnoreMouseEvents(true);
  }
});
