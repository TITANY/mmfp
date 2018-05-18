<template>
    <v-card flat>
        <v-card-text>
            <v-alert color="info" icon="info" value="true">
                Для редактирования содержимого теоретического раздела
                пожалуйста, воспользуйтесь сторонним текстовым редактором!
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                dark color="primary"
                @click="openFile"
            ><v-icon left>insert_drive_file</v-icon>Открыть файл</v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
</template>
<script>
import path from 'path';
import { shell } from 'electron';
import { topics } from '../../../files';

export default {
    name: 'TheoryTabContent',
    props: {
        dir: String
    },
    methods: {
        openFile() {
            return topics.get(this.dir)
                .then(topic => {
                    console.log(topic.path);
                    console.log(topic.raw());
                    shell.showItemInFolder(path.resolve(topic.path, topic.raw().theory.file));
                });
        }
    }
};
</script>
