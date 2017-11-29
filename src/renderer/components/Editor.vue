<template>
<superuser-protector>
    <v-layout row wrap>
        <v-flex>
            <v-card transition="slide-y-reverse-transition">
                <v-card-title primary-title>
                    <div>
                        <div class="headline mb-0" fill-height>Редактирование</div>
                        <div class="grey--text">
                            Редактор тем позволяет создавать и изменять содержание
                            теоретического раздела и тестов
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-subheader>Выберите тему для редактирования:</v-subheader>
                    <v-divider></v-divider>
                    <topics-list
                        @input="onTopicSelected"
                    ></topics-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="createNew">Создать новую</v-btn>
                    <v-btn
                        :dark="selectedTopic !== null"
                        color="teal"
                        :disabled="selectedTopic === null"
                        @click="edit"
                    >Редактировать</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
    <editor-dialog
        :shown="editorOpened"
        @input="onEditorDialogInput"
    >Редактор</editor-dialog>
</superuser-protector>
</template>

<script>
import SuperuserProtector from './misc/SuperuserProtector.vue';
import TopicsList from './TopicsList';
import EditorDialog from './editor/EditorDialog';


export default {
    name: 'editor',

    data() {
        return {
            selectedTopic: null,
            editorOpened: false
        };
    },

    methods: {
        edit() {
            this.editorOpened = true;
        },
        createNew() {},

        onTopicSelected(topic) {
            this.selectedTopic = topic;
        },

        onEditorDialogInput(val) {
            this.editorOpened = val;
        }
    },

    components: {
        SuperuserProtector,
        TopicsList,
        EditorDialog
    }
};
</script>
