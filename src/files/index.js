import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import promisify from './promisify';


const cwd = process.cwd();
const TOPICS_DIR = path.resolve(cwd, 'files', 'topics');

const readDir = promisify(fs.readdir, fs);
const mkdir = promisify(mkdirp);
const readFile = promisify(fs.readFile, fs);
const readText = file => readFile(file, 'utf-8');
const readJson = file => readText(file).then(t => JSON.parse(t));

export const topics = {
    list() {
        return mkdir(TOPICS_DIR)
            .then(() => readDir(TOPICS_DIR))
            .then(dirs => Promise.all(dirs.map(dir => {
                console.log('DIR:', dir);
                const topicJson = path.resolve(TOPICS_DIR, dir, 'topic.json');
                return readJson(topicJson)
                    .then(topic => ({
                        error: console.log(topic) || false,
                        result: Object.assign(topic, { dir })
                    }))
                    .catch(error => ({
                        error,
                        result: console.error(error) || null
                    }));
            })))
            .then(results => results.filter(r => !r.error))
            .then(results => results.map(r => r.result))
        ;
    }
};
