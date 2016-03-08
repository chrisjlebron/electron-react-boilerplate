module.exports = function getMenuTemplate(app, mainWindow, shell) {
  if (arguments.length < 3) throw new Error('Not enough args supplied');

  const getTemplate = (process.platform === 'darwin') ?
    require('./menu/osx') :
    require('./menu/non-osx');

  return getTemplate(app, mainWindow, shell);
};
