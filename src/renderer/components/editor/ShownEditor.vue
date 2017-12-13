<template>
<div>
    <v-switch
        v-model="showAll"
        color="teal"
        label="Отображать все вопросы из группы"
    ></v-switch>

    <v-slide-y-transition mode="out-in">
        <div v-if="!showAll">
            <div><slot>Отображать:</slot></div>
            <v-text-field
                v-model="showMin"
                required
                label="От:"
                prepend-icon="exposure_zero"
                :rules="[notEmpty, isNumber, positive, maxGreaterThanMin]"
            ></v-text-field>
            <v-text-field
                v-model="showMax"
                required
                label="До:"
                prepend-icon="exposure_zero"
                :rules="[notEmpty, isNumber, positive, maxGreaterThanMin]"
            ></v-text-field>
        </div>
    </v-slide-y-transition>
</div>
</template>

<script>
export default {
    name: 'shown-editor',

    props: {
        value: Object
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
        }
    },

    watch: {
        value: {
            handler(nval) {
                if (nval !== null) {
                    this.showAll = nval.all || false;
                    this.showMin = String(nval.min || '1');
                    this.showMax = String(nval.max || '1');
                }
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
    }
};
</script>
