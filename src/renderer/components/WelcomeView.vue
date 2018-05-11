<template>
    <v-layout row wrap justify-center>
        <v-card>
            <v-card-title primary-title>
                <h3 class="headline mb-0">Справка</h3>
            </v-card-title>
            <v-card-text>
                <p>Вызовите список тем нажатием на кнопку в верхней панели.</p>
                <p>Для авторизации выберите пункт "Вход" в меню слева.</p>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
export default {
    name: 'WelcomeTab'
};
</script>

<style scoped>
#wrapper {
    font-size: 2em;
}
</style>
