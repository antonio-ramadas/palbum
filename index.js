const {
    app, ipcMain, globalShortcut, Menu,
} = require('electron');
const menubar = require('menubar');
const path = require('path');
const Authentication = require('./authentication');
const spotifyContext = require('./spotifyContext');

const authentication = new Authentication();
let mb;

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

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => app.quit() },
    ]);

    mb.tray.on('right-click', () => {
        // Only works on macOS and Windows
        // https://electronjs.org/docs/api/tray#traypopupcontextmenumenu-position-macos-windows
        mb.tray.popUpContextMenu(contextMenu);
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

function compare(lhs, rhs) {
    if (lhs < rhs) {
        return -1;
    } if (rhs < lhs) {
        return 1;
    }

    return 0;
}

function getData() {
    return spotifyContext.getUpdatedContextHistory()
        .then(data => data.sort((lhs, rhs) => compare(lhs.context.name, rhs.context.name)))
        .catch(() => console.warn('Failed to retrieve Spotify context history'));
}

function setIpc() {
    ipcMain.on('get-data', (event, arg) => {
        getData()
            .then(data => event.sender.send('update-data', data));
    });

    ipcMain.on('play', (event, arg) => {
        spotifyContext.play(arg)
            .catch(() => console.error(`Failed to play: ${arg}`));
    });

    getData()
        .then(data => mb.window.webContents.send('update-data', data));
}

app.on('ready', () => {
    authenticate()
        .then(() => {
            createTray();
            setIpc();

            // Update data every 10 seconds
            setInterval(() => spotifyContext.getUpdatedContextHistory()
                .then(data => mb.window.webContents.send('update-data', data)), 10000);
        })
        .catch(console.error);
});

// To prevent the login window when closed to quit the application
// https://github.com/electron/electron/blob/master/docs/api/app.md#event-window-all-closed
app.on('window-all-closed', () => {});
