<template>
    <div>
        <v-slide-y-transition mode="out-in">
            <v-layout v-if="!su" row wrap justify-center key="error-message">
                <v-flex xs12 md10 lg6>
                    <v-card transition="slide-y-reverse-transition">
                        <v-card-title primary-title>
                            <div>
                                <div class="headline mb-0" fill-height>Ошибка</div>
                                <div class="red--text">Запрошенный модуль не найден</div>
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn dark color="primary" @click="goHome">В начало</v-btn>
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
import bus from '@/utils/eventbus';

export default {
    name: 'SuperuserProtector',
    computed: {
        su() {
            return this.$store.state.user.superuser || true;
        }
    },
    methods: {
        goHome() {
            bus.$emit('navigate', '/');
        }
    }
};
</script>
