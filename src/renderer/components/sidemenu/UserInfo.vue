<template>
<v-list-tile>
    <v-list-tile-action>
        <v-icon>person</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
        <v-list-tile-title>{{ user.name }}</v-list-tile-title>
    </v-list-tile-content>
</v-list-tile>
</template>

<script>
export default {
    name: 'user-info',
    props: ['data'],
    computed: {
        user: function () { return this.data[0]; }
    }
};
</script>
