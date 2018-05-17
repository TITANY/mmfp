<template>
    <div>
        <v-subheader>{{ question }}</v-subheader>
        <v-radio-group
            :mandatory="false"
            v-model="chosenAnswer"
        >
            <v-radio
                v-for="(answer, j) in answers"
                :label="answer.label"
                :value="answer.id"
                :color="getColor(answer)"
                :class="getClass(answer)"
                :disabled="finished"
                :key="j + '_' + answer.label"
            ></v-radio>
        </v-radio-group>
    </div>
</template>

<script>
export default {
    name: 'TestRadioGroup',
    props: {
        'value': Number,
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
        getColor(a) {
            if (!this.finished) return 'primary';
            return a.correct ? 'green' : 'red';
        },
        getClass(a) {
            if (!this.finished) return [];
            return a.correct ? ['correct-answer'] : [];
        }
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
