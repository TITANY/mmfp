<template>
    <v-dialog v-model="dialog" max-width="600px" content-class="mathjax">
        <v-card>
            <v-card-title>
                <div class="headline mb-0">Сечения взаимодействий</div>
            </v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-layout row wrap align-center>
                        <template
                            v-for="(val, key) in localValue.c"
                        >
                            <v-flex xs2 text-xs-right pr-3 :key="key + '_1'">
                                <span>${{ renderLabel('c', key) }}$</span>
                            </v-flex>
                            <v-flex xs10 :key="key + '_2'">
                                <v-text-field
                                    single-line
                                    v-model="localValue.c[key]"
                                    label="Значение"
                                    suffix="барн"
                                ></v-text-field>
                            </v-flex>
                        </template>

                        <template
                            v-for="(val, key) in localValue.a"
                        >
                            <v-flex xs2 text-xs-right pr-3 :key="key + '_3'">${{ renderLabel('a', key) }}$</v-flex>
                            <v-flex xs10 :key="key + '_4'">
                                <v-text-field
                                    single-line
                                    v-model="localValue.a[key]"
                                    label="Значение"
                                    suffix="барн"
                                ></v-text-field>
                            </v-flex>
                        </template>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    flat
                    @click.stop="resetValues"
                >Сбросить к умолчаниям</v-btn>
                <v-btn
                    dark color="primary"
                    @click="applyValues"
                >Применить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'ConstantsDialog',
    props: {
        sigma: Object,
        defVals: Object,
        show: Boolean
    },

    data() {
        return {
            dialog: this.show,
            localValue: cloneDeep(this.sigma)
        };
    },

    methods: {
        resetValues() {
            this.$emit('input', cloneDeep(this.defVals));
        },

        applyValues() {
            this.$emit('input', this.localValue);
            this.$emit('shown', false);
        },

        renderLabel(ch, n) {
            const digit = n[1];
            const isotope = ({
                '0': 'Pu-240',
                '1': 'Pu-241',
                '5': 'U-235',
                '8': 'U-238',
                '9': 'Pu-239'
            })[digit];
            return `\\sigma_{${ch}}^{${isotope}}`;
        }
    },

    watch: {
        show(nval, oval) {
            if (nval !== oval) {
                this.dialog = nval;
            }
        },
        dialog(nval, oval) {
            if (nval !== oval) {
                this.$emit('shown', nval);
            }
        }
    }
};
</script>
