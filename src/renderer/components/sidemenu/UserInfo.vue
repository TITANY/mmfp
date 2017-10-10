<template>
<v-container class="user-info">
    <v-layout row wrap align-center>
        <v-flex xs2>
            <v-icon class="title">person</v-icon>
        </v-flex>
        <v-flex xs10>
            <div class="title">{{ user.name }}</div>
        </v-flex>

        <v-flex offset-xs2>
            <div>
                Тестирование <b class="green--text">пройдено</b>
                <v-icon class="green--text">done</v-icon>
            </div>
        </v-flex>
    </v-layout>
</v-container>
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

<style>
.user-info {
    background-color: rgba(0,0,0,0.05);
    border-right: teal 5px solid;
}
</style>
