<template>
    <v-dialog
        lazy
        v-model="shown"
        fullscreen
        transition="dialog-bottom-transition"
        :overlay="false"
    >
        <v-card>
            <v-toolbar dark color="primary" tabs>
                <v-btn icon @click.native="close" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    <slot></slot>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn
                        dark
                        flat
                        :loading="loading"
                        @click.native="save"
                    >Сохранить</v-btn>
                </v-toolbar-items>
                <v-tabs
                    fixed icons
                    centered
                    dark color="primary"
                    slider-color="white"
                    v-model="tab"
                    slot="extension"
                >

                    <v-tab href="#topic">
                        <v-icon>content_paste</v-icon>
                        Общее
                    </v-tab>

                    <v-tab href="#theory">
                        <v-icon>library_books</v-icon>
                        Теория
                    </v-tab>

                    <v-tab href="#tests">
                        <v-icon>done_all</v-icon>
                        Тестирование
                    </v-tab>
                </v-tabs>
            </v-toolbar>

            <v-tabs-items v-model="tab">
                <v-tab-item
                    key="topic-tab"
                    id="topic"
                >
                    <v-card flat>
                        <v-card-text>
                            <info-tab-content
                                :value="topicInfo"
                                @input="onInfoTabInput"
                            ></info-tab-content>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item
                    key="theory-tab"
                    id="theory"
                >
                    <theory-tab-content :dir="topicDir"></theory-tab-content>
                </v-tab-item>

                <v-tab-item
                    key="tests-tab"
                    id="tests"
                >
                    <v-card flat>
                        <v-card-text>
                            <tests-tab-content
                                :value="tests"
                                @input="onTestsTabInput"
                                ref="tests"
                            ></tests-tab-content>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-dialog>
</template>
<script>
/* eslint-disable */
import path from 'path';
import { topics } from '../../../files';
import InfoTabContent from './InfoTabContent.vue';
import TestsTabContent from './TestsTabContent.vue';
import TheoryTabContent from './TheoryTabContent.vue';
import Test from '@/classes/tests/Test';


export default {
    name: 'EditorTabs',
    props: {
        'shown': Boolean,
        'topicDir': String
    },

    data() {
        return {
            loading: true,
            tab: 0,

            topicInfo: {
                id: '',
                name: '',
                description: '',
                category: ''
            },

            tests: {
                type: null,
                content: null,
                check: null
            },

            theory: {
                type: null,
                content: null,
                check: null
            }
        };
    },

    methods: {
        save() {
            return topics.update(this.topicDir, { meta: this.topicInfo })
                .then(topic => {
                    this.$refs.tests.save(
                        path.resolve(
                            topics.getDirPath(this.topicDir),
                            topic.raw().tests.file
                        )
                    );
                });
        },

        close() {
            this.$emit('input', false);
        },

        load() {
            if (this.topicDir === null) return;

            this.loading = true;
            return topics.get(this.topicDir)
                .then(topic => {
                    this.topicInfo = topic.meta();

                    return Promise.all([
                        topic.theory(),
                        topic.tests()
                    ]);
                })
                .then(([theory, tests]) => {
                    this.theory = theory;
                    this.tests = tests;
                    this.loading = false;
                });
        },

        onInfoTabInput(ev) {
            Object.assign(this.topicInfo, ev);
        },

        onTestsTabInput(ev) {
            this.tests = ev;
        },

        onTheoryTabInput(ev) {
            Object.assign(this.theory, ev);
        }
    },

    mounted() {
        this.load();
    },

    watch: {
        topicDir(nval, oval) {
            if (nval !== oval) {
                this.load();
            }
        }
    },

    components: {
        InfoTabContent,
        TheoryTabContent,
        TestsTabContent
    }
};
</script>
