<template>
<div>
    <v-subheader>{{ question }}</v-subheader>
    <v-checkbox
        v-for="(answer, j) in answers"
        v-model="chosenAnswer"
        :label="answer"
        :value="j"
        color="teal"
        hide-details
        :key="j + '_' + answer"
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
        'answers': Array
    },
    data() {
        console.log(JSON.stringify(this.value));
        return {
            chosenAnswer: this.value
        };
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