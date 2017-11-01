<template>
<v-layout align-start justify-stretch fill-height>
    <v-card>
        <v-card-title primary-title>
            <h3 class="headline mb-0">Теория</h3>
        </v-card-title>
        <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores atque vel animi. Voluptas soluta repellat, eaque fugiat natus exercitationem suscipit, consequuntur eveniet quae officiis fugit commodi deleniti accusantium eligendi praesentium!
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                dark
                class="teal"
                @click.native="navigate('/testing')"
            >Начать тестирование</v-btn>
            <v-spacer />
        </v-card-actions>
    </v-card>
</v-layout>
</template>

<script>
import bus from '../utils/eventbus';
export default {
    name: 'theory',
    methods: {
        navigate(to) {
            bus.$emit('navigate', to);
        }
    }
};
</script>
