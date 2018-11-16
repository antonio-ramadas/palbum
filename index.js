const { app, Menu, Tray } = require('electron');
const path = require('path');
const Authentication = require('./authentication');

let tray;
let authentication;

function spotify() {
    authentication.authenticate().then(console.log, console.error);
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'resources/icons/PablumTemplate.png'));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);

    authentication = new Authentication();

    spotify();
}

app.on('ready', createTray);

// To prevent the login window when closed to quit the application
// https://github.com/electron/electron/blob/master/docs/api/app.md#event-window-all-closed
app.on('window-all-closed', () => {});
