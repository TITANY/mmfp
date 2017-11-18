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
// import shuffle from 'lodash/shuffle';
import zipWith from 'lodash/zipWith';
import { topics } from '../../files';
import components from './tests';
import LoginProtector from './misc/LoginProtector.vue';
import Test from '../classes/tests/Test';
import '../classes/tests/OTest';


const componentNames = {
    single: 'test-radio-group',
    multiple: 'test-checkboxes'
};

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
                    const test = Test.read(tests.type, tests.content);
                    const rendered = test.render();
                    this.tests = rendered.content;
                    this.meta = rendered.meta;
                    this._test = test; // not reactive
                    this.answers = this.tests.map(q => q.initialAnswer);

                    this.loading = false;
                    this.loaded = true;
                })
                .catch(error => {
                    console.error(error);
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
            const answers = zipWith(this.tests, this.answers, (test, answers) => {
                const uuid = test.uuid;
                const shown = test.answers.map(a => a.id);
                const given = answers;
                return { shown, given, uuid };
            });

            const result = this._test.check(answers);

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

