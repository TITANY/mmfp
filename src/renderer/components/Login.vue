<template>
    <login-protector>
        <v-layout align-center justify-center fill-height>
            <v-flex xs12 md8 lg6>
                <v-card>
                    <v-card-title primary-title>
                        <div class="headline mb-0" fill-height>Авторизация</div>
                    </v-card-title>
                    <v-card-text>
                        <p>Вы авторизованы как {{ username }}.</p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </login-protector>
</template>

<script>
import LoginProtector from './misc/LoginProtector.vue';

export default {
    name: 'LoginTab',

    computed: {
        username() {
            return this.$store.state.user.name;
        }
    },

    components: {
        LoginProtector
    }
};
</script>
