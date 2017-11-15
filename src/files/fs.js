import fs from 'fs';
import mkdirp from 'mkdirp';
import promisify from './promisify';


export const readDir = promisify(fs.readdir, fs);
export const mkdir = promisify(mkdirp);
export const readFile = promisify(fs.readFile, fs);
export const readText = file => readFile(file, 'utf-8');
export const readJson = file => readText(file).then(t => JSON.parse(t));
