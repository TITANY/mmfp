<template>
<v-list two-line subheader>
    <template
        v-for="(cat, i) in cats"
    >
        <v-subheader inset>{{ cat.name }}</v-subheader>
        <v-list-tile
            avatar
            v-for="(topic, j) in cat.content"
            :title="topic.description"
            :class="getClassesFor(topic)"
            :key="j"
            @click="selectTopic(topic)"
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
import { topics } from '../../files';
import bus from '../utils/eventbus';


const labels = {
    'theory': 'Теория',
    'tests': 'Тестирование',
    'model': 'Моделирование'
};

const splitToCats = ts => {
    const cats = {};
    ts.forEach(t => {
        const catName = t.category || 'Без категории';
        const cat = cats[catName];
        if (Array.isArray(cat)) {
            cat.push(t);
        } else {
            cats[catName] = [t];
        }
    });
    return Object.keys(cats)
        .map(catName => ({
            name: catName,
            content: cats[catName]
        }));
};

const normalizeTopic = t => ({
    id: t.meta.id,
    name: t.meta.name,
    description: t.meta.description,
    category: t.meta.category,

    has: {
        theory: typeof t.theory === typeof {},
        tests: typeof t.tests === typeof {},
        model: typeof t.model === typeof {}
    },
    passed: false,

    original: t
});

export default {
    name: 'topics-list',
    props: ['topics'],

    data: () => ({
        cats: [],
        error: false,
        selected: null
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

        selectTopic(topic) {
            bus.$emit('pre-select-topic', topic.original);
            this.selected = topic;
        },

        refresh() {
            topics.list()
                .then(topics => {
                    this.cats = splitToCats(topics.map(normalizeTopic));
                })
                .catch(error => {
                    console.error(error);
                    this.error = true;
                });
        },

        getClassesFor(topic) {
            if (this.selected && topic.id === this.selected.id) {
                return ['teal', 'lighten-4'];
            }
            return [];
        }
    },

    mounted() {
        this.refresh();
    }
};
</script>
