<template>
<v-container grid-list-lg fluid>
    <v-layout row wrap v-if="loaded">

        <!-- Common test info -->
        <v-flex xs12 lg6>
            <v-subheader>Информация о тесте</v-subheader>
            <v-divider></v-divider>

            <v-text-field
                textarea rows="5"
                label="Описание теста"
                color="teal"
                v-model="description"
            ></v-text-field>
        </v-flex>

        <v-flex xs12 lg6>
            <v-subheader>Шкала оценок</v-subheader>
            <v-divider></v-divider>
            <v-list two-line subheader>
                <template v-for="(s, i) in scores.data">
                    <v-list-tile
                        avatar
                        :key="i + '_' + s.title"
                        @click="editScore(s)"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ s.title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ scoreSummary(s) }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn
                                icon
                                ripple
                                @click.stop="removeScore(i)"
                            ><v-icon color="red">delete_forever</v-icon></v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
            <div class="text-xs-right">
                <v-btn
                    dark color="teal"
                    @click="addScore"
                ><v-icon>add</v-icon>Добавить оценку</v-btn>
            </div>
        </v-flex>

        <!-- Question groups -->
        <v-flex xs12 lg4>
            <v-subheader>Группы вопросов</v-subheader>
            <v-divider class="mb-3"></v-divider>

            <v-list two-line>
                <template v-for="(g, i) in groups">
                    <v-list-tile
                        avatar
                        :key="i + '_' + g.label"
                        @click="editGroup(i)"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ g.label }}</v-list-tile-title>
                            <v-list-tile-sub-title>Отображать: {{ groupSummary(g.show) }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn
                                icon
                                ripple
                                @click.stop="removeGroup(i)"
                            ><v-icon color="red">delete_forever</v-icon></v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>

            <div class="text-xs-right">
                <v-btn
                    dark color="teal"
                    @click="addGroup"
                ><v-icon>add</v-icon>Добавить группу</v-btn>
            </div>
        </v-flex>

        <!-- Test content -->
        <v-flex xs12 lg8>
            <v-subheader>Содержимое теста</v-subheader>
            <v-divider class="mb-3"></v-divider>

            <v-stepper v-model="stepper" non-linear>
                <v-stepper-header>
                    <template v-for="(test, i) in tests">
                        <v-divider v-if="i > 0"></v-divider>
                        <v-stepper-step
                            editable
                            :step="i + 1"
                            :key="test.uuid"
                        ></v-stepper-step>
                    </template>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content
                        v-for="(test, i) in tests"
                        :key="test.uuid"
                        :step="i + 1"
                    >
                        <question-editor
                            :groups="groups"
                            :value="test"
                            :answers="test.answers"
                            @input="onQuestionChanged(i, $event)"
                            @answers-changed="onAnswersChanged(i, $event)"
                        ></question-editor>
                        <v-divider></v-divider>

                        <component
                            :is="getComponentNameFor(test)"
                            question="Выберите верные варианты ответа на вопрос:"
                            :answers="test.answers"
                            :value="getAnswer(i)"
                            :finished="false"
                            @input="setAnswer(i, $event)"
                        ></component>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

            <div class="text-xs-right">
                <v-btn
                    dark color="teal"
                    @click="addQuestion"
                ><v-icon>add</v-icon>Добавить вопрос</v-btn>
            </div>
        </v-flex>
    </v-layout>

    <edit-group-dialog
        :show="showGroupDialog"
        :value="selectedGroup"
        @input="onGroupChanged"
        @shown="showGroupDialog = $event"
    ></edit-group-dialog>

    <score-editor-dialog
        :show="showScoreDialog"
        :value="selectedScore"
        @input="onScoreChanged"
        @shown="showScoreDialog = $event"
    ></score-editor-dialog>
</v-container>
</template>

<script>
import Test from '@/classes/tests/Test';
import Question from '@/classes/tests/Question';
import '@/classes/tests/OTest';

import components from '../tests';
import EditGroupDialog from './EditGroupDialog';
import ScoreEditorDialog from './ScoreEditorDialog';
import QuestionEditor from './QuestionEditor';


const componentNames = {
    single: 'test-radio-group',
    multiple: 'test-checkboxes'
};

export default {
    name: 'tests-tab-content',
    props: {
        'value': {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            groups: [{ label: '(default)', show: { all: true } }],
            tests: [],
            // answers: [],
            scores: [],
            description: '',

            selectedGroupIndex: -1,
            showGroupDialog: false,

            selectedScore: null,
            showScoreDialog: false,

            stepper: 0,
            loaded: false
        };
    },

    computed: {
        selectedGroup() {
            if (this.selectedGroupIndex === -1) {
                return null;
            }
            return this.groups[this.selectedGroupIndex];
        }

        // selectedScore() {
        //     if (this.selectedScoreIndex === -1) {
        //         return null;
        //     }
        //     return this.scores.data[this.selectedScoreIndex];
        // }
    },

    methods: {
        groupSummary(shownConfig) {
            if (shownConfig.all) {
                return 'все';
            } else {
                return `от ${shownConfig.min} до ${shownConfig.max}`;
            }
        },
        editGroup(i) {
            this.selectedGroupIndex = i;
            this.showGroupDialog = true;
        },
        addGroup() {
            this.groups.push({
                label: 'Группа #' + (this.groups.length + 1),
                show: { all: true }
            });
        },
        onGroupChanged(changes) {
            this.groups.splice(this.selectedGroupIndex, 1, changes);
        },
        removeGroup(i) {
            this.groups.splice(i, 1);
        },

        editScore(s) {
            this.selectedScore = s;
            this.showScoreDialog = true;
        },
        scoreSummary(s) {
            if (s.default) {
                return '(По умолчанию)';
            } else {
                return `Начиная с ${s.starts_from} баллов`;
            }
        },
        onScoreChanged(changes) {
            const score = this.selectedScore; // this.scores.data[this.selectedScoreIndex];
            Object.assign(score, changes);
            this.scores.sort();
        },
        addScore() {
            this.scores.data.push({
                title: 'Новая оценка',
                starts_from: 0
            });
            this.scores.sort();
        },
        removeScore(i) {
            this.scores.data.splice(i, 1);
        },

        onQuestionChanged(i, changes) {
            const changeAnswer = changes.type !== this.tests[i].type;
            Object.assign(this.tests[i], changes);
            if (changeAnswer) {
                const newQuestion = Question.create(this.tests[i].serialize());
                this.tests.splice(i, 1, newQuestion);

                // HACK: that v-stepper behaves strange when the array item changes -_-
                // so this is important for it to be rendered to user
                const s = this.stepper;
                this.stepper = s + 1;
                setTimeout(() => {
                    this.stepper = s;
                }, 50);
                // this.tests[i] = newQuestion;
            }
        },

        onAnswersChanged(i, newAnswers) {
            const q = this.tests[i];
            q.answers = newAnswers.map((a, j) => {
                a.id = j;
                return a;
            });
            // TODO: make correct answers persistent?
        },

        addQuestion() {},

        load() {
            const test = Test.read(this.value.type, this.value.content);

            this.groups = test.groups;
            this.tests = test.content;
            this.scores = test.scores;
            this.description = test.description;
            // this.answers = this.tests.map(q => {
            //     const correct = q.correct;
            //     if (Array.isArray(correct)) {
            //         return correct.slice();
            //     } else {
            //         return correct;
            //     }
            // });
            this.stepper = 1;
            this.loaded = true;

            this._test = test;
        },

        getComponentNameFor(test) {
            return componentNames[test.type] || 'unknown-test-type';
        },

        getAnswer(i) {
            return this.tests[i].correct;
        },
        setAnswer(i, a) {
            this.tests[i].correct = a;
        }
    },

    components: Object.assign(
        {
            EditGroupDialog,
            ScoreEditorDialog,
            QuestionEditor
        },
        components
    ),

    mounted() {
        this.load();
    },

    watch: {
        value: {
            handler(nval, oval) {
                if (nval.content !== oval.content || nval.type !== oval.type) {
                    this.load();
                }
            },
            deep: true
        }
    }
};
</script>
