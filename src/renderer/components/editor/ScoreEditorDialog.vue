<template>
<v-dialog max-width="400px" v-model="dialog">
    <v-card>
        <v-card-title>Отметка</v-card-title>
        <v-card-text>
            <v-text-field
                label="Название"
                v-model="title"
                prepend-icon="title" color="teal"
                required
            ></v-text-field>

            <v-switch
                label="По умолчанию"
                v-model="isDefault"
                color="teal"
            ></v-switch>

            <v-text-field
                v-if="!isDefault"
                label="Минимальный балл"
                v-model="startsFrom"
                prepend-icon="stars" color="teal"
                required
                :rules="[isNumber]"
            ></v-text-field>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                dark color="teal"
                @click.native.prevent="dialog = false"
            >Готово</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: 'score-editor-dialog',
    props: {
        show: Boolean,
        value: Object
    },

    data() {
        return {
            dialog: false,
            title: '',
            isDefault: true,
            startsFrom: 0
        };
    },

    methods: {
        isNumber(n) {
            return !Number.isNaN(+n) || 'Введите число';
        },

        onChanged() {
            const nval = {
                title: this.title
            };

            if (this.isDefault) {
                nval.default = true;
                nval.starts_from = void 0;
            } else {
                nval.default = void 0;
                nval.starts_from = this.startsFrom;
            }

            this.$emit('input', nval);
        },

        updateLocalValues() {
            this.title = this.value.title;
            this.isDefault = this.value.default;
            this.startsFrom = this.value.starts_from;
        }
    },

    watch: {
        title() { this.onChanged(); },
        isDefault() { this.onChanged(); },
        startsFrom() { this.onChanged(); },

        value(nval) {
            if (nval !== null) {
                this.updateLocalValues();
            }
        },

        show(nval) {
            this.dialog = nval;
        },
        dialog(nval) {
            this.$emit('shown', nval);
        }
    }
};
</script>
