<template>
<div>
    <v-subheader><slot>Отображать:</slot></v-subheader>

    <v-container fluid>
        <v-layout row wrap align-center>
            <v-flex xs12 :md4="collapse">
                <v-switch
                    v-model="showAll"
                    color="teal"
                    label="Все"
                ></v-switch>
            </v-flex>

            <v-flex xs12 :md4="collapse">
                <v-text-field
                    v-if="!showAll"
                    v-model="showMin"
                    required
                    label="От:"
                    :rules="[notEmpty, isNumber, positive, maxGreaterThanMin]"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 :md4="collapse">
                <v-text-field
                    v-if="!showAll"
                    v-model="showMax"
                    required
                    label="До:"
                    :rules="[notEmpty, isNumber, positive, maxGreaterThanMin]"
                ></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
export default {
    name: 'shown-editor',

    props: {
        value: Object,
        collapse: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
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

        maxGreaterThanMin() {
            return (+this.showMax) >= (+this.showMin) || 'Максимальное число должно быть больше минимального';
        },

        onChanged() {
            if (!this.validate()) {
                this.$emit('validation', false);
                return;
            } else {
                this.$emit('validation', true);
            }

            let changes = {};
            if (this.showAll) {
                changes.all = true;
            } else {
                changes = { min: +this.showMin, max: +this.showMax };
            }

            this.$emit('input', changes);
        },

        validate() {
            return this.showAll || ( // show all questions or
                // provide positive numbers for min and max
                this.isNumber(this.showMin) === true &&
                this.isNumber(this.showMax) === true &&
                this.positive(this.showMin) === true &&
                this.positive(this.showMax) === true &&
                ((+this.showMax) >= (+this.showMin))
            );
        },

        updateLocalValue(nval) {
            if (nval !== null) {
                this.showAll = nval.all || false;
                if (!this.showAll) {
                    this.showMin = String(nval.min || '1');
                    this.showMax = String(nval.max || '1');
                }
            }
        }
    },

    watch: {
        value: {
            handler(nval) {
                this.updateLocalValue(nval);
            },
            deep: true
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
    },

    mounted() {
        this.updateLocalValue(this.value);
    }
};
</script>
