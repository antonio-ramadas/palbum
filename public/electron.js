const {
    app, ipcMain, globalShortcut, Menu,
} = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const menubar = require('menubar');
const path = require('path');
const URL = require('url');
const isDev = require('electron-is-dev');
const Authentication = require('./authentication');
const spotifyContext = require('./spotifyContext');
const startupUtil = require('./startup');

const authentication = new Authentication();
let mb;

function authenticate() {
    return authentication.authenticate();
}

function hideWindow() {
    if (process.platform === 'darwin') {
        // On mac, return focus to the last application
        // https://github.com/electron/electron/issues/2640#issuecomment-136306916
        Menu.sendActionToFirstResponder('hide:');
    } else {
        mb.hideWindow();
    }
}

function createTray() {
    const startUrl = isDev ? 'http://localhost:3000' : URL.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
    });

    mb = menubar({
        index: startUrl,
        icon: path.join(__dirname, 'tray-icons/PablumTemplate.png'),
        tooltip: 'Resume playing Spotify back where you left off',
        preloadWindow: true,
    });

    mb.tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Start at login',
                type: 'checkbox',
                checked: startupUtil.isOpenAtLogin(),
                click: () => startupUtil.toggleOpenAtLogin(),
            },
            { label: 'Quit', role: 'quit' },
        ]);

        // Only works on macOS and Windows
        // https://electronjs.org/docs/api/tray#traypopupcontextmenumenu-position-macos-windows
        mb.tray.popUpContextMenu(contextMenu);
    });

    let gs = globalShortcut.register('CommandOrControl+M', () => {
        if (mb.window.isVisible()) {
            hideWindow();
        } else {
            mb.showWindow();
        }
    });

    if (!gs) {
        console.warn('Registration of the global shortcut to show/hide the window has failed.');
    }

    gs = globalShortcut.register('Esc', () => {
        if (mb.window.isVisible()) {
            hideWindow();
        }
    });

    if (!gs) {
        console.warn('Registration of the global shortcut to hide the window has failed.');
    }
}

function getData() {
    const compare = (lhs, rhs) => {
        if (lhs < rhs) {
            return -1;
        }
        if (rhs < lhs) {
            return 1;
        }
        return 0;
    };

    return spotifyContext.getUpdatedContextHistory()
        .then(data => data.sort((lhs, rhs) => compare(lhs.context.name, rhs.context.name)))
        .catch(() => console.warn('Failed to retrieve Spotify context history'));
}

function setIpc() {
    ipcMain.on('get-data', (event) => {
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

// If there is another instance running, then quit this new one
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => mb && mb.showWindow());

    app.on('ready', () => {
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // eslint-disable-line no-unused-vars

        authenticate()
            .catch(() => app.quit())
            .then(() => startupUtil.init())
            .then(() => createTray())
            // REVIEW: If Spotify lifts the restriction of only returning the most recent 50 tracks
            //         then uncomment the following code or update the logic (instead of returning
            //         1 week of tracks, return the most recent XXX tracks).
            .then(() => spotifyContext.update(/* Date.now() - oneWeek */))
            .then(() => {
                setIpc();

                // Update data every 30 seconds
                setInterval(() => spotifyContext.getUpdatedContextHistory()
                    .then(data => mb.window.webContents.send('update-data', data))
                    .catch(err => console.error(err)), 30000);

                // The interval 30 seconds is not random. Spotify only adds songs to the recently
                // played tracks if they are played for more than 30 seconds. Given that there is
                // no hook from Spotify to let know when there are new updates, we poll the API
                // every 30 seconds.
                // Check the following link for more information:
                // https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
            })
            .then(() => {
                // Show window only if the app did not start at login
                if (startupUtil.shouldShowWindow()) {
                    mb.showWindow();
                }
            })
            .catch(err => console.error(err));
    });

    // To prevent the login window when closed to quit the application
    // https://github.com/electron/electron/blob/master/docs/api/app.md#event-window-all-closed
    app.on('window-all-closed', () => {});
}
