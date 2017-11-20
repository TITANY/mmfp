const fs = require('fs');
const { app } = require('electron');

const fns = {
    'quit': () => {
        app.quit();
    },

    'listFiles': () => {
        return new Promise((resolve, reject) => {
            const cwd = process.cwd();
            fs.readdir(cwd, (err, files) => {
                if (err) reject(err);
                resolve({
                    dir: cwd,
                    files
                });
            });
        });
    }
};

export default function (cmd, params) {
    const fn = fns[cmd];
    if (typeof fn === typeof Function) {
        return fn(params);
    } else {
        throw new Error('No such command: ' + cmd);
    }
}
