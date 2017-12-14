<template>
<div>
    <v-subheader>Общая информация</v-subheader>

    <v-text-field
        label="Текст вопроса"
        v-model="question"
        prepend-icon="help"
        required
    ></v-text-field>

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

    <v-select
        :items="groupsList"
        v-model="qGroup"
        label="Группа"
        item-text="label"
        item-value="id"
        prepend-icon="group_work"
        required
    ></v-select>

    <v-divider></v-divider>
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

    <shown-editor
        v-model="shownAnswers"
    >Показывать ответов:</shown-editor>
    <v-divider></v-divider>

    <shown-editor
        v-model="shownCorrect"
        v-if="shownCorrectEditable"
    >Показывать правильных ответов:</shown-editor>
</div>
</template>

<script>
import ShownEditor from './ShownEditor.vue';


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
        value: Object,
        groups: Array
    },

    data() {
        return {
            qType: 'single',
            checkType: 'simple',
            qGroup: 0,
            question: '?',

            shownAnswers: { all: true },
            shownCorrect: { all: true },

            scores: {}
        };
    },

    computed: {
        qTypesList() { return typesList; },
        checkTypesList() { return checkTypesList; },

        selectedCheckTypeScores() {
            return checkTypesList.filter(t => t.type === this.checkType)[0].scores;
        },

        groupsList() {
            return this.groups.map(({ label }, id) => ({ label, id }));
        },

        shownCorrectEditable() {
            return this.qType !== 'single';
        }
    },

    methods: {
        getScoreValue(name) {
            return this.scores[name] || 0;
        },
        setScoreValue(name, val) {
            this.scores[name] = val;
        },

        onChanged() {
            const nval = {
                type: this.qType,
                checkType: this.checkType,
                question: this.question,
                group: this.qGroup,
                shown: this.shownAnswers,

                shownCorrect: { all: true }
            };

            if (this.shownCorrectEditable) {
                nval.shownCorrect = this.shownCorrect;
            }

            this.$emit('input', nval);
        },
        updateLocalValue() {
            this.qType = this.value.type;
            this.checkType = this.value.checkType;
            this.question = this.value.question;
            this.qGroup = this.value.group.id;
            this.shownAnswers = this.value.shown;

            this.shownCorrect = this.value.shownCorrect;
        },

        updateScores() {
            const scores = this.selectedCheckTypeScores;
            this.scores = scores.reduce((obj, nextScore) => {
                obj[nextScore.name] = nextScore.defVal;
                return obj;
            }, {});
        }
    },

    watch: {
        checkType() {
            this.updateScores();
            this.onChanged();
        },

        value() {
            this.updateLocalValue();
        },

        qType() { this.onChanged(); },
        question() { this.onChanged(); },
        qGroup() { this.onChanged(); },
        shownAnswers: { handler() { this.onChanged(); }, deep: true },
        shownCorrect: { handler() { this.onChanged(); }, deep: true }
    },

    mounted() {
        this.updateLocalValue();
        // this.updateScores();
    },

    components: { ShownEditor }
};
</script>
