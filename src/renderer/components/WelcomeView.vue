<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md8 lg6>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">Справка</h3>
                </v-card-title>
                <v-card-text>
                    <p>Вызовите список тем нажатием на кнопку в верхней панели.</p>
                    <p>Для авторизации выберите пункт "Вход" в меню слева.</p>
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
