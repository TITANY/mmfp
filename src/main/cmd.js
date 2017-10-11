const { app } = require('electron');

const fns = {
    'quit': () => {
        app.quit();
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
