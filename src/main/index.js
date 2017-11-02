'use strict';

import { app, BrowserWindow, ipcMain } from 'electron';
import cmd from './cmd';


ipcMain.on('cmd', (event, arg) => {
    try {
        let reply = cmd(arg.cmd, arg.params);
        console.error(reply);
        if (reply !== void 0) {
            if (!(reply instanceof Promise)) {
                if (reply instanceof Error)
                    reply = Promise.reject(reply);
                else
                    reply = Promise.resolve(reply);
            }
            reply
                .then(reply => event.sender.send('cmd', { error: false, reply }))
                .catch(err => event.sender.send('cmd', { error: true, reply: err }));
        }
    } catch (err) {
        console.error(err);
        event.sender.send('cmd', { error: true, reply: err });
    }
});

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    });

    mainWindow.loadURL(winURL);

    mainWindow.maximize();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
})

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates();
})
 */
