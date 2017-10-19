<template>
<v-list two-line subheader>
    <template
        v-for="(cat, i) in cats"
    >
        <v-subheader inset>{{ cat.name }}</v-subheader>
        <v-list-tile
            avatar
            v-for="topic in cat.content"
            :key="i"
            @click="selectTopic(i)"
        >
            <v-list-tile-avatar>
                <v-icon>{{ getIcon(topic) }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ topic.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ getDescription(topic) }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-btn icon ripple>
                    <v-icon color="grey lighten-1">folder</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
        <v-divider inset></v-divider>
    </template>
</v-list>
</template>

<script>
const labels = {
    'theory': 'Теория',
    'tests': 'Тестирование',
    'model': 'Моделирование'
};

export default {
    name: 'topics-list',
    props: ['topics'],

    data: () => ({
        cats: [
            {
                name: 'Категория 1',
                content: [
                    {
                        name: 'Тема 1.1',
                        has: { theory: true, tests: true, model: true },
                        passed: false
                    },
                    {
                        name: 'Тема 1.2',
                        has: { theory: true, tests: true, model: false },
                        passed: true
                    },
                    {
                        name: 'Тема 1.3',
                        has: { theory: true, tests: false, model: false },
                        passed: true
                    }
                ]
            },
            {
                name: 'Категория 2',
                content: [
                    {
                        name: 'Тема 2.1',
                        has: { theory: false, tests: true, model: true },
                        passed: false
                    },
                    {
                        name: 'Тема 2.2',
                        has: { theory: true, tests: true, model: false },
                        passed: true
                    },
                    {
                        name: 'Тема 2.3',
                        has: { theory: true, tests: true, model: false },
                        passed: false
                    },
                    {
                        name: 'Тема 2.4',
                        has: { theory: true, tests: false, model: true },
                        passed: false
                    }
                ]
            }
        ]
    }),

    methods: {
        getIcon(topic) {
            return topic.passed ? 'check_circle' : 'insert_drive_file';
        },

        getDescription(topic) {
            const l = [];
            for (let key in labels) {
                if (topic.has[key]) {
                    l.push(labels[key]);
                }
            };
            const p = topic.passed ? 'пройдено' : 'не пройдено';
            return `${l.join(', ')} (${p})`;
        },

        selectTopic() {}
    }
};
</script>
