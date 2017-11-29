import path from 'path';
import { mkdir, readDir, readJson } from './fs';
import readSection from './section';

const cwd = process.cwd();
const TOPICS_DIR = path.join('files', 'topics');
const TOPICS_DIR_ABS = path.resolve(cwd, TOPICS_DIR);
const TOPIC_JSON = 'topic.json';

export const topics = {
    list() {
        return mkdir(TOPICS_DIR_ABS)
            .then(() => readDir(TOPICS_DIR_ABS))
            .then(dirs => Promise.all(dirs.map(dir => {
                const topicJson = path.resolve(TOPICS_DIR_ABS, dir, TOPIC_JSON);
                return readJson(topicJson)
                    .then(topic => ({
                        error: false,
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
    },

    get(dirname) {
        return mkdir(TOPICS_DIR_ABS)
            .then(() => readJson(path.resolve(TOPICS_DIR_ABS, dirname, TOPIC_JSON)))
            .then(topic => {
                return {
                    meta() {
                        return topic.meta;
                    },

                    theory() {
                        return readSection(topic.theory, path.resolve(TOPICS_DIR_ABS, dirname));
                    },

                    tests() {
                        return readSection(topic.tests, path.resolve(TOPICS_DIR_ABS, dirname));
                    },

                    model() {
                        return readSection(topic.model, path.resolve(TOPICS_DIR_ABS, dirname));
                    },

                    path: path.join(TOPICS_DIR, dirname)
                };
            })
        ;
    }
};
