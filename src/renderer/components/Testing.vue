<template>
    <login-protector>
        <v-layout row wrap justify-center>
            <v-flex xs10 ossfet-xs1>
                <v-card>
                    <v-card-title class="headline">Тестирование</v-card-title>
                    <v-card-text>
                        <p v-if="error" class="red--text">{{ error }}</p>
                        <p v-if="!loaded && !loading" class="center--text">
                            Выберите тему, нажав на иконку списка в панели сверху.
                        </p>
                        <div v-if="loading">
                            <p>Загрузка теста...</p>
                            <v-progress-circular indeterminate color="teal"></v-progress-circular>
                        </div>
                        <template v-if="loaded && !loading">
                            <div class="pb-3">
                                <div>{{ meta.description }}</div>
                                <div><b>Автор:</b> {{ meta.changedBy }}</div>
                                <div><b>Создан:</b> {{ meta.changedAt.toLocaleString() }}</div>
                            </div>

                            <v-alert color="info" icon="info" :value="finished" v-if="finished">
                                <div>Результат: {{ testResult.title }}</div>
                                <div>Баллы: {{ testResult.score }}</div>
                            </v-alert>
                            
                            <template
                                v-for="(test, i) in tests"
                            >
                                <v-divider></v-divider>
                                <component
                                    :is="getComponentNameFor(test)"
                                    :question="test.question"
                                    :answers="test.answers"
                                    :value="getAnswer(i)"
                                    :finished="finished"
                                    @input="setAnswer(i, $event)"
                                ></component>
                            </template>
                        </template>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="loaded && !loading"
                            class="teal white--text"
                            @click="checkResults"
                        >Закончить тестирование</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </login-protector>
</template>

<script>
import shuffle from 'lodash/shuffle';
import zipWith from 'lodash/zipWith';
import diff from 'lodash/difference';
import intersect from 'lodash/intersection';
import { topics } from '../../files';
import components from './tests';
import LoginProtector from './misc/LoginProtector.vue';


const testsParsers = {
    'obfuscated_test': content => {
        const parsed = JSON.parse(content);
        parsed.meta = {
            description: parsed.meta.description || '(нет описания)',
            scores: parsed.meta.scores.sort((a, b) => {
                if (a.default) return -1;
                if (b.default) return 1;
                return a.starts_from - b.starts_from;
            }),
            changedBy: parsed.meta.changed_by,
            changedAt: new Date(parsed.meta.changed_at)
        };
        return parsed;
    }
};

const checkTypes = {
    simple: (given, correct, { win, lose }) => {
        if (given.length !== correct.length) return lose;
        given.sort();
        correct.sort();
        for (let i = 0; i < given.length; i++) {
            if (given[i] !== correct[i])
                return lose;
        }
        return win;
    },

    // eslint-disable-next-line camelcase 
    vdist: (given, correct, { match, false_match, false_mismatch = false_match }) => {
        const falseMatches = diff(given, correct);
        const falseMismatches = diff(correct, given);
        const matches = intersect(correct, given);

        return (
            false_match    * falseMatches.length +      // eslint-disable-line camelcase, no-multi-spaces
            false_mismatch * falseMismatches.length +   // eslint-disable-line camelcase, no-multi-spaces
            match          * matches.length             // eslint-disable-line camelcase, no-multi-spaces
        );
    }
};

const componentNames = {
    single: 'test-radio-group',
    multiple: 'test-checkboxes'
};

const prepareTestAnswers = testDescription => {
    const answers = testDescription.answers.map((label, id) => ({
        label,
        id
    }));
    const { min, max } = testDescription.shown_answers;

    // extracting correct answers
    let correctAnswersIndexes = [];
    if (testDescription.type === 'single') {
        correctAnswersIndexes.push(testDescription.await);
    } else {
        correctAnswersIndexes = testDescription.await.slice();
    }
    // and incorrect ones (shuffled to randomize their pick)
    const incorrectAnswers = shuffle(
        answers
            .filter(
                (_, i) => !correctAnswersIndexes.includes(i)
            )
    );

    // all correct answers should be shown
    let shownAnswers = correctAnswersIndexes.map(i => ({
        label: answers[i].label,
        id: answers[i].id,
        correct: true
    }));
    // not less than total correct answers count
    const answersCount = Math.max(shownAnswers.length, Math.floor(Math.random() * (max - min)) + min);
    // how many incorrect answers we should include (not more than we have at total)
    const n = Math.min(answersCount - shownAnswers.length, incorrectAnswers.length);
    shownAnswers = shownAnswers.concat(
        incorrectAnswers
            .slice(0, n)
            .map(({label, id}) => ({
                label,
                id,
                correct: false
            }))
    );
    return shuffle(shownAnswers);
};

const wrapIntoArrayIf = (condition, v) => condition ? [v] : v;

export default {
    name: 'testing',

    data() {
        return {
            tests: [],
            answers: [],
            meta: {
                description: '',
                scores: [],
                changedBy: null,
                changedAt: null
            },

            results: [],

            loaded: false,
            loading: false,
            error: false
        };
    },

    computed: {
        selectedTopic() {
            return this.$store.state.selectedTopic;
        },

        selectedTopicDir() {
            const topic = this.$store.state.selectedTopic;
            if (typeof topic === typeof {} && topic !== null)
                return this.$store.state.selectedTopic.dir;
            else
                return void 0;
        },

        finished() {
            return this.$store.state.tests.finished;
        },
        testResult() {
            return this.$store.state.tests.result;
        }
    },

    methods: {
        loadAndShow(dirname) {
            this.loading = true;
            this.loaded = false;
            return topics.get(dirname)
                .then(topic => topic.tests())
                .then(tests => {
                    if (tests.type in testsParsers) {
                        const parsed = testsParsers[tests.type](tests.content);
                        this.tests = parsed.content.map(t => {
                            t.answers = prepareTestAnswers(t);
                            return t;
                        });
                        this.answers = parsed.content.map(t => ({
                            // default answers for types
                            'single': () => -1,
                            'multiple': () => []
                        })[t.type]());
                        this.meta = parsed.meta;
                    }

                    this.loading = false;
                    this.loaded = true;
                })
                .catch(error => {
                    this.error = error.toString();
                    this.loaded = false;
                    this.loading = false;
                });
        },

        getAnswer(i) {
            return this.answers[i];
        },
        setAnswer(i, a) {
            if (!this.finished) {
                this.answers.splice(i, 1, a);
            }
        },

        checkResults() {
            const results = zipWith(this.tests, this.answers, (test, answers) => {
                const isSingle = test.type === 'single';
                const
                    given = wrapIntoArrayIf(isSingle, answers),
                    expected = wrapIntoArrayIf(isSingle, test.await);

                const checker = checkTypes[test.check_type];

                if (checker) {
                    const score = checker(given, expected, test.points);
                    return score;
                } else {
                    throw new TypeError('Unknown test type: ' + test.check_type);
                }
            });

            const score = results.reduce((sum, i) => sum + i, 0);

            const result = { title: null, score };
            for (let i = 0; i < this.meta.scores.length; i++) {
                const s = this.meta.scores[i];
                if (s.default) {
                    result.title = s.title;
                    continue;
                } else {
                    if (s.starts_from > score) {
                        break;
                    } else {
                        result.title = s.title;
                    }
                }
            }

            this.$store.commit('finishTests', { result });
        },

        getComponentNameFor(test) {
            return componentNames[test.type] || 'unknown-test-type';
        }
    },
    mounted() {
        if (this.selectedTopic) {
            this.loadAndShow(this.selectedTopicDir);
        }
    },
    watch: {
        selectedTopicDir(nval, oval) {
            if (nval !== oval)
                this.loadAndShow(nval);
        }
    },
    components: Object.assign(
        {
            LoginProtector
        },
        components
    )
};
</script>

<style lang="stylus">
.correct-answer label
    color: #4caf50 !important
    font-weight: bold
</style>

