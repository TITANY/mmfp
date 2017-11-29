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
                <v-toolbar-title><slot></slot></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click.native="save">Сохранить</v-btn>
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

            <v-tabs-items>
                <v-tabs-content
                    key="topic-tab"
                    id="topic"
                >
                    <v-card flat>
                        <v-card-text>Общее</v-card-text>
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
                        <v-card-text>Тест</v-card-text>
                    </v-card>
                </v-tabs-content>
            </v-tabs-items>
        </v-tabs>

    </v-card>
</v-dialog>
</template>
<script>
export default {
    name: 'editor-tabs',
    props: {
        'shown': Boolean
    },

    data() {
        return {};
    },

    methods: {
        save() {

        },

        close() {
            this.$emit('input', false);
        }
    },

    components: {}
};
</script>
