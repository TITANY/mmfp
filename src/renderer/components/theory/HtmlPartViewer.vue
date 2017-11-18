<template>
<div>
    <div v-html="content" class="html-part-viewer-content mathjax">
    </div>
</div>
</template>

<script>
import path from 'path';
import $ from 'jquery';

// some black magic with importing d3 and functionPlot
// fuck functionPlot
import * as d3 from 'd3';
window.d3 = d3;
const functionPlot = require('function-plot');


const getRandomId = () => 'formula_' + new Array(16).fill(null)
    .map(_ => Math.floor(Math.random() * 16))
    .map(r => '0123456789abcdef'[r])
    .join('');

export default {
    name: 'html-part-viewer',
    props: {
        'content': {
            type: String,
            default: 'Ошибка загрузки теории!'
        },
        'path': {
            type: String
        }
    },

    methods: {
        parseScripts() {
            // formulas
            const $content = $('.html-part-viewer-content');
            const formulas = $content.find('script[type="application/x-math-plot"]');

            formulas.each(function () {
                const $this = $(this);

                $this.replaceWith(`
                    <div class="math-plot-wrapper">
                        <div
                            id="${getRandomId()}" class="math-plot"
                            data-formula="${$this.text()}"
                        ></div>
                        <div class="math-plot-label">${$this.text()}</div>
                    </div>
                `);
            });

            $content.find('.math-plot').each(function () {
                const $this = $(this);

                functionPlot({
                    target: '#' + $this.attr('id'),
                    data: [{
                        fn: $.trim($this.attr('data-formula')).replace(/[\r\n]/g, ''),
                        sampler: 'builtIn', // this will make function-plot use the evaluator of math.js
                        graphType: 'polyline'
                    }]
                });
            });

            // mathjax
            window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);

            // images
            const vm = this;
            $content.find('img').each(function () {
                const $this = $(this);
                if ($this.attr('data-processed') !== 'true') {
                    $this.attr('data-processed', 'true');
                    const src = $.trim($this.attr('src'));
                    $this.attr('data-src', src);
                    $this.attr('src', path.join(vm.path, src));
                }
            });

            this.scriptsParsed = true;
        }
    },

    watch: {
        content() {
            this.parseScripts();
        }
    },
    mounted() {
        this.parseScripts();
    },
    activated() {
        if (!this.scriptsParsed) {
            this.parseScripts();
        }
    }
};
</script>

<style lang="stylus">
.math-plot-wrapper
    text-align: center
    padding-top: 0.8em
    padding-bottom: 1em
    
    & .math-plot-label
        font-weight: bold
        padding-top: 0.2em
</style>
