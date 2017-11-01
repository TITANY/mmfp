<template>
    <v-layout row wrap justify-center>
        <v-flex xs10 ossfet-xs1>
            <v-card>
                <v-card-title class="headline">Тестирование</v-card-title>
                <v-card-text>
                    <v-radio-group
                        v-for="(task, i) in tests"
                        :key="i"
                        v-model="answers[i]"
                        :mandatory="false"
                    >
                        <p>{{ task.question }}</p>
                        <v-radio
                            v-for="(answer, j) in task.answers"
                            :label="answer"
                            :value="j"
                            :key="j"
                        ></v-radio>
                        <v-divider></v-divider>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="teal white--text">Закончить тестирование</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: 'testing',

    data() {
        return {
            tests: [
                {
                    question: `Какого цвета учебник?`,
                    answers: [
                        `Синий`,
                        `Зелёный`,
                        `Чёрный (основы)`
                    ]
                },
                {
                    question: `Автор скольки статей и научных работ?`,
                    answers: [
                        `300`,
                        `1337`,
                        `144`,
                        `Более 400`
                    ]
                }
            ],

            answers: []
        };
    }
};
</script>
