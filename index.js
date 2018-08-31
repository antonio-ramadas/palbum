const { app, Menu, Tray } = require('electron');
const path = require('path');

let tray;

function createTray() {
    tray = new Tray(path.join(__dirname, 'resources/icons/PablumTemplate.png'));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);
}

app.on('ready', createTray);
