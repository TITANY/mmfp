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

            <v-switch
                v-model="showAll"
                color="teal"
                label="Отображать все вопросы из группы"
            ></v-switch>

            <v-slide-y-transition mode="out-in">
                <div v-if="!showAll">
                    <div>Количество вопросов для отображения:</div>
                    <v-text-field
                        v-model="showMin"
                        required
                        label="От:"
                        prepend-icon="exposure_zero"
                        :rules="[notEmpty, isNumber, positive]"
                    ></v-text-field>
                    <v-text-field
                        v-model="showMax"
                        required
                        label="До:"
                        prepend-icon="exposure_zero"
                        :rules="[notEmpty, isNumber, positive]"
                    ></v-text-field>
                </div>
            </v-slide-y-transition>

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
            showAll: false,
            showMin: '1',
            showMax: '1'
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
                show: {}
            };
            if (this.showAll) {
                changes.show.all = true;
            } else {
                changes.show = { min: +this.showMin, max: +this.showMax };
            }


            this.$emit('input', changes);
        },

        validate() {
            return this.groupName.length > 0 && ( // group name should be provided, and
                this.showAll || ( // show all questions or
                    // provide positive numbers for min and max
                    this.isNumber(this.showMin) === true &&
                    this.isNumber(this.showMax) === true &&
                    this.positive(this.showMin) === true &&
                    this.positive(this.showMax) === true
                )
            );
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
                    this.showAll = nval.show.all || false;
                    this.showMin = String(nval.show.min || 1);
                    this.showMax = String(nval.show.max || 1);
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

        groupName(nval) {
            this.onChanged();
        },
        showAll(nval) {
            this.onChanged();
        },
        showMin(nval) {
            this.onChanged();
        },
        showMax(nval) {
            this.onChanged();
        }
    }
};
</script>
