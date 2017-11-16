<template>
<div>
    <v-subheader>{{ question }}</v-subheader>
    <v-radio-group
        :mandatory="false"
        v-model="chosenAnswer"
    >
        <v-radio
            v-for="(answer, j) in answers"
            :label="answer"
            :value="j"
            :key="j + '_' + answer"
        ></v-radio>
    </v-radio-group>
</div>
</template>

<script>
export default {
    name: 'test-radio-group',
    props: {
        'value': Number,
        'question': String,
        'answers': Array
    },
    data() {
        return {
            chosenAnswer: this.value
        };
    },
    watch: {
        chosenAnswer(nval, oval) {
            if (nval !== oval) {
                this.$emit('input', nval);
            }
        },
        value(nval, oval) {
            this.chosenAnswer = nval;
        }
    }
};
</script>