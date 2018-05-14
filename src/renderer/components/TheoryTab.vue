<template>
    <v-layout row wrap align-start justify-stretch fill-height>
        <v-flex>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">Теория</h3>
                </v-card-title>
                <v-card-text>
                    <p v-if="!loaded && !loading" class="center--text">
                        Выберите тему, нажав на иконку списка в панели сверху.
                    </p>
                    <div v-if="loading">
                        <p>Загрузка...</p>
                        <v-progress-circular indeterminate color="teal"></v-progress-circular>
                    </div>
                    <component
                        v-if="loaded && !loading"
                        :is="getComponentName(contentType)"
                        :content="content"
                        :path="contentPath"
                        :content-type="contentType"
                    ></component>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        dark
                        class="teal"
                        @click.native="navigate('/testing')"
                    >Начать тестирование</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import bus from '../utils/eventbus';
import { topics } from '../../files';
import components from './theory';

const contentTypes = {
    'html_part': 'html-part-viewer'
};

export default {
    name: 'TheoryTab',
    data() {
        return {
            loaded: false,
            loading: false,
            content: null,
            contentType: null,
            contentPath: '',
            checked: true
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
        }
    },
    methods: {
        navigate(to) {
            bus.$emit('navigate', to);
        },

        loadAndShow(dirname) {
            this.loading = true;
            this.loaded = false;
            return topics.get(dirname)
                .then(topic => topic.theory().then(t => [topic, t]))
                .then(([topic, theory]) => {
                    this.content = theory.content;
                    this.contentType = theory.type;
                    this.checked = theory.checked;
                    this.contentPath = topic.path;

                    console.log(topic);

                    this.loading = false;
                    this.loaded = true;
                });
        },

        getComponentName(contentType) {
            if (contentType in contentTypes) {
                return contentTypes[contentType];
            } else {
                return 'unknown-content-type';
            }
        }
    },
    watch: {
        selectedTopicDir(nval, oval) {
            if (nval !== oval)
                this.loadAndShow(nval);
        }
    },
    mounted() {
        if (this.selectedTopic) {
            this.loadAndShow(this.selectedTopicDir);
        }
    },
    components: Object.assign(
        {},
        components
    )
};
</script>
