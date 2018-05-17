<template>
    <div class="isotope-content-model mathjax">
        <v-subheader>Начальные параметры</v-subheader>

        <v-container fluid>
            <v-layout row wrap align-center>
                <template
                    v-for="(val, key) in fields"
                >
                    <v-flex xs2 md1 text-xs-right pr-3 :key="key + '_1'">${{ val }}$</v-flex>
                    <v-flex xs10 md11 lg5 :key="key + '_2'">
                        <v-text-field
                            single-line
                            v-model="model[key]"
                            label="Значение"
                        ></v-text-field>
                    </v-flex>
                </template>
            </v-layout>
        </v-container>

        <div class="text-xs-right">
            <v-btn
                flat
                @click="showConstantsDialog = true"
            >Изменить константы</v-btn>
            <v-btn
                dark color="primary"
                @click="refreshModel"
            >Рассчитать</v-btn>
        </div>
        <v-divider></v-divider>
        <v-subheader>Графики зависимостей</v-subheader>
        <v-divider></v-divider>

        <div v-show="false" class="view-source">
            <script
                type="application/x-math-plot"
                data-y="c_5"
                :data-label="c5z"
            >{{ c5 }}</script>

            <v-divider></v-divider>

            <script
                type="application/x-math-plot"
                data-y="c_9"
                :data-label="c9z"
            >{{ c9 }}</script>

            <v-divider></v-divider>

            <script
                type="application/x-math-plot"
                data-y="c_0"
                :data-label="c0z"
            >{{ c0 }}</script>

            <v-divider></v-divider>

            <script
                type="application/x-math-plot"
                data-y="c_1"
                :data-label="c1z"
            >{{ c1 }}</script>
        </div>
        <div class="view-destination">Отрисовка...</div>

        <constants-dialog
            :sigma="model.sigma"
            :def-vals="defSigma"
            :show="showConstantsDialog"
            @input="changeConstants"
            @shown="showConstantsDialog = $event"
        ></constants-dialog>
    </div>
</template>

<script>
import $ from 'jquery';
import mathjs from 'mathjs';
import ICModel from '@/classes/models/ICModel';
import ConstantsDialog from './IsotopeContent/ConstantsDialog.vue';

// some black magic with importing d3 and functionPlot
// fuck functionPlot
import * as d3 from 'd3';
window.d3 = d3;
const functionPlot = require('function-plot');


const getRandomId = () => 'formula_' + new Array(16).fill(null)
    .map(_ => Math.floor(Math.random() * 16))
    .map(r => '0123456789abcdef'[r])
    .join('');

const getRenderableFn = (name, model) => model.formulas()[name].replace(/z/g, 'x');
const getWritableFn = (name, model) => model.formulas()[name].replace(/(\.[0-9]{3})([0-9]+)/g, '$1');

export default {
    name: 'IsotopeContent',
    props: {
        content: String
    },

    data() {
        const model = new ICModel();
        return {
            model,

            fields: {
                mu: '\\mu',
                phi: '\\phi',
                nuEff5: '\\nu_{эфф}^5',
                N5_0: 'N_5^0',
                N8: 'N_8'
            },

            defSigma: new ICModel(model).sigma,

            showConstantsDialog: false
        };
    },

    computed: {
        c0() { return getRenderableFn('c0', this.model); },
        c0z() { return getWritableFn('c0', this.model); },

        c5() { return getRenderableFn('c5', this.model); },
        c5z() { return getWritableFn('c5', this.model); },

        c9() { return getRenderableFn('c9', this.model); },
        c9z() { return getWritableFn('c9', this.model); },

        c1() { return getRenderableFn('c1', this.model); },
        c1z() { return getWritableFn('c1', this.model); }
    },

    methods: {
        parseScripts() {
            const $content = $('.isotope-content-model .view-destination');
            const formulas = $content.find('script[type="application/x-math-plot"]');

            formulas.each(function () {
                const $this = $(this);

                const tex = '$' + $this.attr('data-y') +
                    ' = ' + mathjs.simplify($this.attr('data-label')).toTex() + '$';

                $this.replaceWith(`
                    <div class="math-plot-wrapper text-xs-center my-4">
                        <div
                            id="${getRandomId()}" class="math-plot"
                            data-formula="${$this.text()}"
                        ></div>
                        <div class="math-plot-label">${tex}</div>
                    </div>
                `);
            });

            $content.find('.math-plot').each(function () {
                const $this = $(this);

                functionPlot({
                    target: '#' + $this.attr('id'),
                    xAxis: {domain: [0, 10]},
                    data: [{
                        fn: $.trim($this.attr('data-formula')).replace(/[\r\n]/g, ''),
                        sampler: 'builtIn', // this will make function-plot use the evaluator of math.js
                        range: [0, Infinity],
                        graphType: 'polyline'
                    }]
                });
            });

            // mathjax
            this.updateMathJax();
        },

        refreshModel() {
            const $src = $('.isotope-content-model .view-source');
            const $dest = $('.isotope-content-model .view-destination');
            $dest.html($src.html());

            this.parseScripts();
        },

        changeConstants(vals) {
            Object.assign(this.model.sigma, vals);
        },

        updateMathJax() {
            window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
        }
    },

    watch: {
        showConstantsDialog(nval) {
            if (nval) {
                this.updateMathJax();
            }
        }
    },

    mounted() {
        this.refreshModel();
    },

    components: { ConstantsDialog }
};
</script>

<style lang="stylus" scoped>
.math-plot-label
    overflow: auto
    max-width: 100%
</style>
