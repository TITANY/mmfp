<template>
    <div>
        <v-subheader>Общая информация о теме</v-subheader>
        <v-divider class="mb-3"></v-divider>

        <v-container fluid>
            <v-layout row justify-center>
                <v-flex xs12 md8 lg6>
                    <v-form>
                        <v-text-field
                            name="id"
                            label="Идентификатор"
                            prepend-icon="code"
                            :value="value.id"
                            @input="onPropChanged('id', $event)"
                        ></v-text-field>

                        <v-text-field
                            name="name"
                            label="Название"
                            prepend-icon="title"
                            :value="value.name"
                            @input="onPropChanged('name', $event)"
                        ></v-text-field>

                        <v-text-field
                            name="cat"
                            label="Название категории"
                            prepend-icon="list"
                            :value="value.category"
                            @input="onPropChanged('category', $event)"
                        ></v-text-field>

                        <v-text-field
                            multi-line
                            name="description"
                            label="Описание темы"
                            prepend-icon="description"
                            :value="value.description"
                            @input="onPropChanged('description', $event)"
                        ></v-text-field>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'InfoTabContent',
    props: {
        'value': Object
    },

    methods: {
        onPropChanged(prop, nval) {
            this.$emit('input', { [prop]: nval });
        }
    }
};
</script>
