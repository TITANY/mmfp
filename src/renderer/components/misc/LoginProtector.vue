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
                                color="primary"
                                ref="usernameTextField"
                                :rules="[value => !!value.length || 'Имя не может быть пустым']"
                            ></v-text-field>

                            <v-text-field
                                v-show="showPassword"
                                name="password"
                                label="Пароль"
                                v-model="password"
                                ref="passwordTextField"
                                prepend-icon="vpn_key"
                                :append-icon="vis ? 'visibility' : 'visibility_off'"
                                :append-icon-cb="() => (vis = !vis)"
                                :type="vis ? 'password' : 'text'"
                                :rules="[validatePassword]"
                            ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                dark
                                class="primary"
                                :loading="loading"
                                @click="logIn"
                            >Вход</v-btn>
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
import bcrypt from 'bcrypt';


const HASH = '$2a$10$b48ov3eZw.xv9Bam8eg7QeR67m/2Tjrr96QGcSEm1RhjImretd4z2';

export default {
    name: 'LoginProtector',

    data: function () {
        return {
            username: '',
            showPassword: false,
            password: '',
            wrongPassword: false,
            loading: false,
            vis: true
        };
    },

    computed: {
        loggedIn() {
            return this.$store.state.user.loggedIn;
        }
    },

    methods: {
        logIn() {
            if (this.username === '') {
                this.$refs.usernameTextField.validate(true);
                return;
            }

            if (this.username === 'Admin') {
                if (this.showPassword) {
                    this.loading = true;
                    return bcrypt.compare(this.password, HASH)
                        .then(result => {
                            this.loading = false;
                            if (result) {
                                this.wrongPassword = false;
                                this.$store.commit('logIn', { name: this.username, superuser: true });
                            } else {
                                this.wrongPassword = true;
                                this.$refs.passwordTextField.validate(true);
                            }
                        });
                } else {
                    this.showPassword = true;
                    return;
                }
            }

            this.$store.commit('logIn', { name: this.username });
        },

        validatePassword() {
            if (this.wrongPassword)
                return 'Неверный пароль';
            return true;
        }
    }
};
</script>
