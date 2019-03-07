const { app } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const store = require('./store');

/**
 * Opening the app at login currently only works on windows and mac, because those are the OS
 * supported by electron (https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows).
 *
 * All the other OS (linux) can be supported by using [auto-launch](https://www.npmjs.com/package/auto-launch)
 * or by simply copycat the linux implementation to start at login (no need to replicate features
 * already present in electron).
 *
 * If you know how to fix it, why haven't you?
 * If you check [_electron.js_](electron.js) you'll notice that the popover context on the tray/dock
 * icon only works on mac and windows. There, it appears a button to toggle the app launch at login
 * but that same popover is not shown in linux which may lead to some hurdles and can even be
 * rightfully considered as bad UX (imagine an app that self-attaches to start on login, but it
 * presents no controls to disable it).
 */

const settings = {
    openAtLogin: true,
    openAsHidden: true, // Only works on mac
};

function init() {
    if (!store.has('firstTime')) {
        store.set('firstTime', false);
        app.setLoginItemSettings(settings);
    }
}

function isOpenAtLogin() {
    return app.getLoginItemSettings().openAtLogin;
}

function toggleOpenAtLogin() {
    app.setLoginItemSettings({
        openAtLogin: !isOpenAtLogin(),
        openAsHidden: true,
    });
}

/**
 * On windows and mac it is possible to open the application at login. By default, the application
 * is launched as hidden (does not show the tray/dock window). However, on mac, the users have
 * external controls to choose whether they want or not the application to launch as hidden.
 * This implementation follows this UX.
 *
 * If the application was not launched at login (i.e., was intentionally opened by the user), then
 * show the window to give feedback that everything worked properly. On any OS that is neither mac
 * nor windows, the window should be shown by default.
 *
 * @returns {boolean} False if the application was at startup. True otherwise. This implementation
 *                    is not uniform. On mac, it is possible to the application start at login and
 *                    show the window if the user changes the settings.
 */
function shouldShowWindow() {
    const { wasOpenedAtLogin, wasOpenedAsHidden } = app.getLoginItemSettings();

    let shouldShow = true;

    // Login item settings does not work properly on all OS
    if (process.platform === 'darwin') {
        shouldShow = !(wasOpenedAtLogin && wasOpenedAsHidden);
    } else if (process.platform === 'win32') {
        shouldShow = !wasOpenedAtLogin;
    }

    return shouldShow;
}

module.exports = {
    init, shouldShowWindow, isOpenAtLogin, toggleOpenAtLogin,
};
