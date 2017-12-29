import path from 'path';
import { v4 } from 'uuid';
import { mkdir, readDir, readJson, writeFile, writeJson } from './fs';
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

                    raw() {
                        return topic;
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
    },

    create(dirname = v4()) {
        const defaultJsonContent = {
            meta: { id: dirname, name: 'Новая тема', description: '', category: '(нет)' },
            theory: { file: 'content.html', type: 'html_part', check: '', images: [] },
            tests: { file: 'test.ots', type: 'obfuscated_test', check: '' },
            model: false
        };

        const defaultTestContent = {
            meta: {
                description: 'Новый тест',
                'scores': [
                    { 'title': 'Незачёт', 'default': true }
                ],
                'groups': [
                    {
                        'label': 'Group 1',
                        'show': { all: true }
                    }
                ],
                'changed_by': 'bob',
                'changed_at': new Date().toISOString()
            },
            'content': [
                {
                    'answers': [
                        'A',
                        'B'
                    ],
                    'await': 1,
                    'check_type': 'simple',
                    'points': { 'win': 1, 'lose': 0 },
                    'question': 'A or B?',
                    'shown_answers': { all: true },
                    'type': 'single',
                    'group': 0
                }
            ]
        };

        const p = path.resolve(TOPICS_DIR_ABS, dirname);

        return mkdir(p)
            .then(() => writeJson(path.resolve(p, TOPIC_JSON), defaultJsonContent))
            .then(() => writeFile(path.resolve(p, 'content.html'), '<h2>Новая тема</h2>'))
            .then(() => writeJson(path.resolve(p, 'test.ots'), defaultTestContent))
            .then(() => topics.get(dirname));
    },

    update(dirname, content) {
        const p = path.resolve(TOPICS_DIR_ABS, dirname);
        return mkdir(p)
            .then(() => readJson(path.resolve(p, TOPIC_JSON)))
            .then(topic => {
                Object.assign(topic, content);
                writeJson(path.resolve(p, TOPIC_JSON), topic);
            })
            .then(() => topics.get(dirname));
    },

    getDirPath(dirname) {
        return path.resolve(TOPICS_DIR_ABS, dirname);
    }
};
