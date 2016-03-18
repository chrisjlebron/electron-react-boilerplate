/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const electron = require('electron');
const Postitioner = require('electron-positioner');
// const menubar = require('menubar');
const Tray = electron.Tray
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;

const mainIconPath = path.join(__dirname, 'app', 'assets', 'iconTemplate.png');
const mainIconHighlight = path.join(__dirname, 'app', 'assets', 'iconHighlight.png');
const secondaryIconPath = path.join(__dirname, 'app', 'assets', 'eye-1.png');

// const mb = menubar({
//   dir: `${__dirname}/app`,
//   icon: mainIconPath,
//   preloadWindow: true
// });

let tray = null;
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

app.dock.hide();

app.on('window-all-closed', () => {
  console.log('app.on => window-all-closed');
  // prevent window closing from quitting the app
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  console.log('app.on => ready');
  const size = getLargestWindowSize();

  tray = new Tray(mainIconPath);
  tray.setPressedImage(mainIconHighlight);

  restWindow = createRestWindow(size);
  prefsWindow = createPrefsWindow();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Take a Rest',
      type: 'normal',
      icon: mainIconPath,
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('taking a rest...');
        state.isResting = true;

        // mb.tray.setImage(secondaryIconPath);
        tray.setImage(secondaryIconPath);

        console.log('before', state);
        setTimeout(() => {
          state.isResting = false;
          console.log('after', state);
          // mb.tray.setImage(mainIconPath);
          tray.setImage(mainIconPath);
        }, 10000);
      }
    },
    {
      label: `Disable for ${disableLength}`,
      type: 'checkbox',
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('disabling...');
        console.log(thisMenuItem);
        setTimeout(() => {
          thisMenuItem.checked = false;
          // On Linux in order for changes made to individual MenuItems
          // to take effect, you have to call setContextMenu again
          tray.setContextMenu(contextMenu);
          // mb.tray.setContextMenu(contextMenu);
        }, 2000);
      }
    },
    { type: 'separator' },
    {
      label: 'Preferences',
      type: 'normal',
      click: (thisMenuItem, thisBrowserWindow) => {
        console.log('opening prefs window...');
        prefsWindow = createPrefsWindow();
        displayPrefsWindow();
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: () => {
        // const size = getLargestWindowSize();

        restWindow = createRestWindow(size);
        displayRestWindow();
      }
    },
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  // mb.tray.setContextMenu(contextMenu);
  tray.setContextMenu(contextMenu);
  tray.on('click', (...args) => {
    console.log('here we go...\n\n\n');
    console.log(args);
  });
});


app.on('browser-window-blur', () => {
  console.log('app.on => browser-window-blur');
  if (state.isResting) {
    restWindow.focus();
    // restWindow.setIgnoreMouseEvents(true);
  }
});


function createRestWindow(opts) {
  const width = opts.width || 1280;
  const height = opts.height || 800;

  if (!restWindow) {
    restWindow = new BrowserWindow({
      // enableLargerThanScreen: true,
      // titleBarStyle: 'hidden', // traffic lights appear to be part of the page
      // type: 'desktop', // makes it act like a desktop background
      x: 0, y: 0, // place it in top left corner
      width,
      height,
      alwaysOnTop: true,
      frame: false, // removes all window chrome, including traffic lights
      resizable: false,
      movable: false,
      show: false
    });

    restWindow.loadURL(`file://${__dirname}/views/rest.html`);

    restWindow.on('closed', () => {
      restWindow = null;
    });
  }
  return restWindow;
}

function displayRestWindow() {
  restWindow.setVisibleOnAllWorkspaces(true);
  restWindow.setMenuBarVisibility(false); // not sure what it does yet...
  restWindow.show();
  restWindow.toggleDevTools();
  return restWindow;
}

function createPrefsWindow() {
  // console.log(mb.positioner);
  if (!prefsWindow) {
    prefsWindow = new BrowserWindow({
      frame: false,
      width: 600,
      height: 600,
      show: false
    });

    let position = new Postitioner(prefsWindow);
    // console.log(position.calculate('trayRight', trayBounds));

    prefsWindow.loadURL(`file://${__dirname}/views/preferences.html`);

    prefsWindow.on('closed', () => {
      prefsWindow = null;
    });

    prefsWindow.on('blur', () => {
      prefsWindow.close();
    });
  }


  return prefsWindow;
  // isFocused
  // isVisible
  // isMaximized
  // isMinimized
  // isFullScreen
  // isAlwaysOnTop
  // isKiosk
  // setClosable(false)
  // on('blur', fn)
  // setVisibleOnAllWorkspaces(true)
}

function displayPrefsWindow() {
  prefsWindow.show();
  prefsWindow.toggleDevTools();
}

function getLargestWindowSize() {
  const screen = electron.screen;
  const displays = screen.getAllDisplays();
  return displays.reduce((acc, current) => {
    if ((!acc.width || !acc.height) ||
    (current.size.width * current.size.height > acc.width * acc.height)) {
      acc.width = current.size.width;
      acc.height = current.size.height;
    }
    return acc;
  }, {});
}
