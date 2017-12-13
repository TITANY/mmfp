<template>
<v-dialog v-model="localShow" max-width="500px">
    <v-card>
        <v-card-title>Редактировать группу</v-card-title>
        <v-card-text>
            <v-text-field
                v-model="groupName"
                label="Название"
                prepend-icon="title"
                required
                :rules="[notEmpty]"
            ></v-text-field>

            <shown-editor
                :value="showConfig"
                @input="onShowConfigChanged"
                @validation="showConfigValid = $event"
            >Количество вопросов для отображения:</shown-editor>

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                dark color="teal"
                @click="close"
            >Готово</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import ShownEditor from './ShownEditor.vue';

export default {
    name: 'edit-group-dialog',

    props: {
        value: Object,
        show: Boolean
    },

    data() {
        return {
            localShow: false,

            groupName: '',
            showConfig: { all: true },
            showConfigValid: true
        };
    },

    methods: {
        isNumber(n) {
            return !Number.isNaN(+n) || 'Введите число';
        },
        notEmpty(s) {
            return (s.length > 0) || 'Это обязательное поле';
        },
        positive(n) {
            return (+n > 0) || 'Введите положительное число';
        },

        onChanged() {
            if (!this.validate()) {
                return;
            }

            const changes = {
                label: this.groupName,
                show: this.showConfig
            };

            this.$emit('input', changes);
        },

        onShowConfigChanged(nval) {
            this.showConfig = nval;
        },

        validate() {
            return this.groupName.length > 0 && this.showConfigValid;
        },

        close() {
            if (this.validate()) {
                this.localShow = false;
            }
        }
    },

    watch: {
        value: {
            handler(nval) {
                if (nval !== null) {
                    this.groupName = nval.label;
                    this.showConfig = nval.show;
                }
            },
            deep: true
        },

        show(nval) {
            this.localShow = nval;
        },
        localShow(nval) {
            this.$emit('shown', nval);
        },

        groupName() {
            this.onChanged();
        },
        showConfig() {
            this.onChanged();
        }
    },

    components: { ShownEditor }
};
</script>
