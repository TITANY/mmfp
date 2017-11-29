<template>
<v-dialog
    lazy
    v-model="shown"
    fullscreen
    transition="dialog-bottom-transition"
    :overlay="false"
>
    <v-card>
        <v-tabs fixed icons centered>
            <v-toolbar dark color="teal">
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
            </v-toolbar>

            <v-tabs-bar dark color="teal">
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tabs-item href="#topic">
                    <v-icon>content_paste</v-icon>
                    Общее
                </v-tabs-item>

                <v-tabs-item href="#theory">
                    <v-icon>library_books</v-icon>
                    Теория
                </v-tabs-item>

                <v-tabs-item href="#tests">
                    <v-icon>done_all</v-icon>
                    Тестирование
                </v-tabs-item>
            </v-tabs-bar>

            <v-tabs-items v-if="!loading">
                <v-tabs-content
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
                </v-tabs-content>

                <v-tabs-content
                    key="theory-tab"
                    id="theory"
                >
                    <v-card flat>
                        <v-card-text>Теория</v-card-text>
                    </v-card>
                </v-tabs-content>

                <v-tabs-content
                    key="tests-tab"
                    id="tests"
                >
                    <v-card flat>
                        <v-card-text>
                            <tests-tab-content
                                :value="tests"
                                @input="onTestsTabInput"
                            ></tests-tab-content>
                        </v-card-text>
                    </v-card>
                </v-tabs-content>
            </v-tabs-items>
        </v-tabs>

    </v-card>
</v-dialog>
</template>
<script>
import { topics } from '../../../files';
import InfoTabContent from './InfoTabContent.vue';
import TestsTabContent from './TestsTabContent.vue';


export default {
    name: 'editor-tabs',
    props: {
        'shown': Boolean,
        'topicDir': String
    },

    data() {
        return {
            loading: true,

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
            Object.assign(this.tests, ev);
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
        TestsTabContent
    }
};
</script>
