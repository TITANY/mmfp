import path from 'path';
import { mkdir, readDir, readJson } from './fs';
import readSection from './section';

const cwd = process.cwd();
const TOPICS_DIR = path.resolve(cwd, 'files', 'topics');
const TOPIC_JSON = 'topic.json';

export const topics = {
    list() {
        return mkdir(TOPICS_DIR)
            .then(() => readDir(TOPICS_DIR))
            .then(dirs => Promise.all(dirs.map(dir => {
                console.log('DIR:', dir);
                const topicJson = path.resolve(TOPICS_DIR, dir, TOPIC_JSON);
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
        return mkdir(TOPICS_DIR)
            .then(() => readJson(path.resolve(TOPICS_DIR, dirname, TOPIC_JSON)))
            .then(topic => {
                return {
                    theory() {
                        return readSection(topic.theory, path.resolve(TOPICS_DIR, dirname));
                    },

                    tests() {
                        return readSection(topic.tests, path.resolve(TOPICS_DIR, dirname));
                    },

                    model() {
                        return readSection(topic.model, path.resolve(TOPICS_DIR, dirname));
                    }
                };
            })
        ;
    }
};
