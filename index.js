const {
    app, ipcMain, globalShortcut, Menu,
} = require('electron');
const menubar = require('menubar');
const path = require('path');
const Authentication = require('./authentication');

const authentication = new Authentication();
let mb;
const data = [
    {
        albumTitle: 'Bananas',
        song: 'Monkey',
        url: 'https://via.placeholder.com/40',
    },
];

function authenticate() {
    return authentication.authenticate();
}

function createTray() {
    mb = menubar({
        index: 'http://localhost:3000/', // https://via.placeholder.com/400',
        icon: path.join(__dirname, 'resources/icons/PablumTemplate.png'),
        tooltip: 'Resume playing Spotify back where you left off',
        preloadWindow: true,
    });

    const gs = globalShortcut.register('CommandOrControl+M', () => {
        if (mb.window.isVisible()) {
            // https://github.com/electron/electron/issues/2640#issuecomment-136306916
            Menu.sendActionToFirstResponder('hide:');
        } else {
            mb.showWindow();
        }
    });

    if (!gs) {
        console.warn('Registration of the global shortcut to show/hide the window has failed.');
    }
}

function setIpc() {
    ipcMain.on('get-data', (event, arg) => {
        event.sender.send('update-data', data);
    });

    mb.window.webContents.send('update-data', data);
}

app.on('ready', () => {
    authenticate()
        .then(() => {
            createTray();
            setIpc();
        })
        .catch(console.error);
});

// To prevent the login window when closed to quit the application
// https://github.com/electron/electron/blob/master/docs/api/app.md#event-window-all-closed
app.on('window-all-closed', () => {
});
