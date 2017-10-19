<template>
<v-expansion-panel>
    <v-expansion-panel-content>
        <div slot="header">Общее</div>
        <v-card>
            <v-card-title class="headline">Общие настройки приложения</v-card-title>
            <v-card-text>
                Общие настройки приложения...
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content>
        <div slot="header">Внешний вид</div>
        <v-card>
            <v-card-title class="headline">Настройки внешнего вида</v-card-title>
            <v-card-text>
                Настройки внешнего вида...
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content>
        <div slot="header">Авторизация</div>
        <v-card>
            <v-card-title class="headline">Настройки авторизации</v-card-title>
            <v-card-text>
                Настройки авторизации...
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content>
        <div slot="header">Журналирование</div>
        <v-card>
            <v-card-title class="headline">Настройки журналирования</v-card-title>
            <v-card-text>
                Настройки журналирования...
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
</v-expansion-panel>
</template>

<script>
export default {
    name: 'settings-content',
    // props: 'settings',
    data() {
        return {};
    }
};
</script>
