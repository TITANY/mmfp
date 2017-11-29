<template>
<div>
    <v-select
        :items="qTypesList"
        v-model="qType"
        label="Тип вопроса"
        item-text="label"
        item-value="type"
        prepend-icon="device_hub"
        required
    ></v-select>

    <v-select
        :items="checkTypesList"
        v-model="checkType"
        label="Тип проверки ответа"
        item-text="label"
        item-value="type"
        prepend-icon="check_circle"
        required
    ></v-select>

    <v-subheader>Начисление очков</v-subheader>

    <template
        v-for="(s, i) in selectedCheckTypeScores"
    >
        <v-text-field
            :key="i + '_' + s.name"
            :label="s.label"
            :value="getScoreValue(s.name)"
            @input="setScoreValue(s.name, $event)"
        ></v-text-field>
    </template>

    <v-divider></v-divider>
</div>
</template>

<script>
const typesList = [
    { type: 'single', label: 'С одним ответом' },
    { type: 'multiple', label: 'С несколькими ответами' }
];

const checkTypesList = [
    {
        type: 'simple',
        label: 'Полное совпадение',
        scores: [
            { name: 'win', label: 'Верный ответ', defVal: 1 },
            { name: 'lose', label: 'Неверный ответ', defVal: 0 }
        ]
    },
    {
        type: 'vdist',
        label: 'Частичное совпадение',
        scores: [
            { name: 'match', label: 'Выбран верный вариант', defVal: 1 },
            { name: 'false_match', label: 'Выбран неверный вариант', defVal: -1 },
            { name: 'false_mismatch', label: 'Не выбран верный вариант', defVal: -1 }
        ]
    }
];

export default {
    name: 'question-editor',
    props: {
        value: Object
    },

    data() {
        return {
            qType: 'single',
            checkType: 'simple',

            scores: {}
        };
    },

    computed: {
        qTypesList() { return typesList; },
        checkTypesList() { return checkTypesList; },

        selectedCheckTypeScores() {
            return checkTypesList.filter(t => t.type === this.checkType)[0].scores;
        }
    },

    methods: {
        getScoreValue(name) {
            return this.scores[name] || 0;
        },
        setScoreValue(name, val) {
            this.scores[name] = val;
        }
    },

    watch: {
        checkType() {
            const scores = this.selectedCheckTypeScores;
            this.scores = scores.reduce((obj, nextScore) => {
                obj[nextScore.name] = nextScore.defVal;
                return obj;
            }, {});
        }
    }
};
</script>
