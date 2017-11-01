import { ipcRenderer } from 'electron';

const send = (cmd, args) => ipcRenderer.send('cmd', { cmd, args });

const fns = {
    'quit': () => {
        send('quit');
    },

    'listFiles': () => {
        send('listFiles');
        return new Promise((resolve, reject) => {
            ipcRenderer.on('cmd', (event, arg) => {
                if (arg.error)
                    reject(arg.reply);
                else
                    resolve(arg.reply);
            });
        });
    }
};

export default function (cmd, args) {
    const fn = fns[cmd];
    if (typeof fn === typeof Function) {
        return fn(args);
    } else {
        throw new Error('cmd: No such function: ' + cmd);
    }
}
