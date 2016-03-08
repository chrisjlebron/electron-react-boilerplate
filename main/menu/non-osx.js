module.exports = function getTemplate(app, mainWindow, shell) {
  const msg = (arg) => `Argument '${arg}' not supplied`;

  if (typeof app === 'undefined') throw new Error(msg('app'));
  if (typeof mainWindow === 'undefined') throw new Error(msg('mainWindow'));
  if (typeof shell === 'undefined') throw new Error(msg('shell'));

  return [
    /**
     * File Menu
     */
    {
      label: '&File',
      submenu: [
        {
          label: '&Open',
          accelerator: 'Ctrl+O'
        },
        {
          label: '&Close',
          accelerator: 'Ctrl+W',
          click() {
            mainWindow.close();
          }
        }
      ]
    },

    /**
     * View Menu
     */
    {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [
        {
          label: '&Reload',
          accelerator: 'Ctrl+R',
          click() {
            mainWindow.restart();
          }
        },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click() {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'Alt+Ctrl+I',
          click() {
            mainWindow.toggleDevTools();
          }
        }
      ] : [
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click() {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },

    /**
     * Help Menu
     */
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('http://electron.atom.io');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/atom/electron/issues');
          }
        }
      ]
    }
  ];
};
