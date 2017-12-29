<template>
<login-protector>
    <v-layout row wrap justify-center>
        <v-flex>
            <v-card>
                <v-card-title>
                    <h3 class="headline mb-0">Моделирование</h3>
                </v-card-title>
                <v-card-text>
                    <p v-if="!loaded && !loading" class="center--text">
                        Выберите тему, нажав на иконку списка в панели сверху.
                    </p>
                    <div v-if="loading">
                        <p>Загрузка...</p>
                        <v-progress-circular indeterminate color="teal"></v-progress-circular>
                    </div>
                    <div v-if="error">
                        <v-alert color="error" icon="warning" value="true">
                            {{ error }}
                        </v-alert>
                    </div>
                    <component
                        v-if="loaded && !loading"
                        :is="getComponentName(contentType)"
                        :content="content"
                        :content-type="contentType"
                    ></component>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</login-protector>
</template>

<script>
import LoginProtector from './misc/LoginProtector.vue';
import { topics } from '../../files';
import components from './models';


const componentsForTypes = {
    'builtin_isotope_content': 'isotope-content'
};

export default {
    name: 'model-view',

    data() {
        return {
            loading: false,
            loaded: false,
            error: false,

            contentType: null,
            content: null,
            checked: false
        };
    },

    computed: {
        selectedTopicDir() {
            const topic = this.$store.state.selectedTopic;
            if (typeof topic === typeof {} && topic !== null)
                return topic.dir;
            else
                return void 0;
        }
    },

    methods: {
        load(dirname) {
            this.loading = true;
            this.loaded = false;
            this.error = false;
            return topics.get(dirname)
                .then(topic => topic.model().then(m => [topic, m]))
                .then(([topic, model]) => {
                    if (model === null) {
                        this.error = 'Раздел моделирования не предусмотрен для этой темы!';
                        this.loading = false;
                        return;
                    }
                    this.content = model.content;
                    this.contentType = model.type;
                    this.checked = model.checked;
                    // this.contentPath = topic.path;

                    this.loading = false;
                    this.loaded = true;
                })
                .catch(err => {
                    console.log(err);
                    this.error = err.message || String(err);
                });
        },

        getComponentName(contentType) {
            return componentsForTypes[contentType] || 'unknown-model-type';
        }
    },

    watch: {
        selectedTopicDir(nval, oval) {
            if (nval !== oval)
                this.load(nval);
        }
    },
    mounted() {
        if (this.selectedTopicDir) {
            this.load(this.selectedTopicDir);
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
