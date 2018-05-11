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
                    Тестирование
                    <b v-if="test.finished" class="green--text">пройдено</b>
                    <b v-else class="red--text">не пройдено</b>
                </div>
                <v-slide-y-transition mode="out-in">
                    <div v-if="test.finished">
                        Отметка: <b>{{ test.result.title }}</b>
                        <i>(баллы: {{ test.result.score }})</i>
                    </div>
                </v-slide-y-transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'UserInfo',
    props: ['user'],
    computed: {
        test() {
            return this.$store.state.tests;
        }
    }
};
</script>

<style>
.user-info {
    background-color: rgba(0,0,0,0.05);
    border-right: teal 5px solid;
}
</style>
