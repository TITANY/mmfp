<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md8 lg6>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">Начало работы</h3>
                </v-card-title>
                <v-card-text>
                    <p>Начните работать с приложением, выполняя следующие действия:</p>
                    <ul class="pl-3">
                        <li>
                            <b>Выберите тему</b>, нажав кнопку
                            <code><v-icon>list</v-icon></code>
                            в верхней панели;
                        </li>
                        <li>
                            Авторизуйтесь, вызвав <b>главное меню</b> приложения кнопкой
                            <code><v-icon>menu</v-icon></code>
                            ;
                        </li>
                        <li>
                            Кнопка
                            <code><v-icon>settings</v-icon></code>
                            даёт доступ к <b>настройкам</b> приложения.
                        </li>
                    </ul>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    name: 'WelcomeView'
};
</script>
<style scoped>
#wrapper {
    font-size: 2em;
}
</style>
