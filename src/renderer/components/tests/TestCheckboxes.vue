<template>
    <div>
        <v-subheader>{{ question }}</v-subheader>
        <v-checkbox
            v-for="(answer, j) in answers"
            v-model="chosenAnswer"
            :label="answer.label"
            :value="answer.id"
            :class="getClass(answer)"
            color="teal"
            :disabled="finished"
            hide-details
            :key="j + '_' + answer.label"
        ></v-checkbox>
    </div>
</template>

<script>
import isEqual from 'lodash/isEqual';

export default {
    name: 'TestCheckboxes',
    props: {
        'value': Array,
        'question': String,
        'answers': Array,
        'finished': Boolean
    },
    data() {
        return {
            chosenAnswer: this.value
        };
    },
    methods: {
        getClass(a) {
            if (!this.finished) return [];
            return a.correct ? ['correct-answer'] : [];
        }
    },
    watch: {
        chosenAnswer(nval, oval) {
            if (!isEqual(nval, oval)) {
                this.$emit('input', nval.slice());
            }
        },
        value(nval) {
            this.chosenAnswer = nval;
        },
        answers(nval) {
            this.chosenAnswer = this.chosenAnswer
                .filter(i => i < nval.length);
        }
    }
};
</script>
