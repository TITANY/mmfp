<template>
<div>
    <v-subheader>{{ question }}</v-subheader>
    <v-checkbox
        v-for="(answer, j) in answers"
        v-model="chosenAnswer"
        :label="answer.label"
        :value="j"
        :color="getColor(answer)"
        :class="getClass(answer)"
        hide-details
        :key="j + '_' + answer.label"
    ></v-checkbox>
</div>
</template>

<script>
import isEqual from 'lodash/isEqual';

export default {
    name: 'test-checkboxes',
    props: {
        'value': Array,
        'question': String,
        'answers': Array,
        'finished': Boolean
    },
    data() {
        console.log(JSON.stringify(this.value));
        return {
            chosenAnswer: this.value
        };
    },
    methods: {
        getColor(a) {
            if (this.finished) {
                return a.correct ? 'green' : 'red';
            }
            return 'teal';
        },
        getClass(a) {
            if (!this.finished) return [];
            return a.correct ? ['correct-answer'] : [];
        }
    },
    watch: {
        chosenAnswer(nval, oval) {
            if (!isEqual(nval, oval)) {
                this.$emit('input', nval);
            }
        },
        value(nval) {
            this.chosenAnswer = nval;
        }
    }
};
</script>
