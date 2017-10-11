import { ipcRenderer } from 'electron';

const send = (cmd, args) => ipcRenderer.send('cmd', { cmd, args });

const fns = {
    'quit': () => {
        send('quit');
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
