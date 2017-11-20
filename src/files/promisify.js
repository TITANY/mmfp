export default function promisify(target, thisArg = null) {
    return (...args) => new Promise((resolve, reject) => {
        target.call(thisArg, ...args, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
