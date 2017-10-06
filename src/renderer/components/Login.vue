<template>
<v-layout align-center justify-center fill-height>
    <v-card>
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
</v-layout>
</template>

<script>
import eventBus from '../utils/eventbus';

export default {
    name: 'login',

    data: function () {
        return {
            username: ''
        };
    },

    methods: {
        logIn: function () {
            if (this.username === '') {
                this.$refs.usernameTextField.validate(true);
                return;
            }
            eventBus.$emit('user-login', { username: this.username });
        }
    }
};
</script>
