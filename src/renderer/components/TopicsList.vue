<template>
    <v-list two-line subheader>
        <template
            v-for="(cat, i) in cats"
        >
            <v-subheader inset :key="i + '_subheader'">{{ cat.name }}</v-subheader>
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
            <v-divider inset :key="i + '_divider'"></v-divider>
        </template>
        <v-list-tile v-if="!cats.length">
            <v-list-tile-content>
                <div class="text-xs-center body-2 grey--text" style="width: 100%;">(тем не найдено)</div>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>

<script>
import { topics } from '../../files';


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
    name: 'TopicsList',
    props: {
        'value': String
    },

    data: () => ({
        cats: [],
        error: false,
        selected: this.value
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
            this.$emit('input', topic.original);
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
    },

    watch: {
        value(nval) {
            for (let i = 0; i < this.cats.length; i++) {
                const cat = this.cats[i];
                for (let j = 0; j < cat.content.length; j++) {
                    const topic = cat.content[j];
                    if (topic.id === nval) {
                        this.selected = topic;
                        return;
                    }
                }
            }
            // console.error('Cannot find such topic: ', nval);
            this.selected = null;
        }
    }
};
</script>
