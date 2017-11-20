<template>
<div>
<v-slide-y-transition mode="out-in">
    <v-layout v-if="!loggedIn" row wrap justify-center key="login-form">
        <v-flex xs12 md10 lg6>
            <v-card transition="slide-y-reverse-transition">
                <v-card-title primary-title>
                    <div>
                        <div class="headline mb-0" fill-height>Авторизация</div>
                        <div class="grey--text">Для прохождения тестирования и работы с моделью необходимо представиться.</div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        name="username"
                        v-model="username"
                        label="Ваше имя"
                        prepend-icon="person"
                        color="teal"
                        ref="usernameTextField"
                        :rules="[value => !!value.length || 'Имя не может быть пустым']"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn dark class="teal" @click="logIn">Вход</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
    <div v-else key="protected-content">
        <slot></slot>
    </div>
</v-slide-y-transition>
</div>
</template>

<script>
export default {
    name: 'login-protector',

    data: function () {
        return {
            username: ''
        };
    },

    computed: {
        loggedIn() {
            return this.$store.state.user.loggedIn;
        }
    },

    methods: {
        logIn: function () {
            if (this.username === '') {
                this.$refs.usernameTextField.validate(true);
                return;
            }

            this.$store.commit('logIn', { name: this.username });
        }
    }
};
</script>