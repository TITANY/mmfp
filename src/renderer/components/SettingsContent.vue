<template>
    <v-expansion-panel>
        <v-expansion-panel-content>
            <div slot="header">Общее</div>
            <v-card>
                <v-card-title class="headline">Общие настройки приложения</v-card-title>
                <v-card-text>
                    <div>
                        Путь к файлам приложения: <code>{{ appDataPath }}</code>
                        <v-tooltip right>
                            <span>Открыть папку</span>
                            <v-btn
                                flat icon ripple
                                slot="activator"
                                @click="openAppDataFolder"
                            ><v-icon>folder_open</v-icon></v-btn>
                        </v-tooltip>
                    </div>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
            <div slot="header">Внешний вид</div>
            <v-card>
                <v-card-title class="headline">Настройки внешнего вида</v-card-title>
                <v-card-text>
                    <v-select
                        :items="availableZooms"
                        v-model="zoom"
                        prepend-icon="search"
                        label="Масштаб интерфейса"
                        item-text="label"
                        item-value="value"
                    ></v-select>
                    <v-switch
                        label="Тёмная тема"
                        v-model="darkTheme"
                        color="teal"
                    ></v-switch>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="su">
            <div slot="header">Авторизация</div>
            <v-card>
                <v-card-title class="headline">Настройки авторизации</v-card-title>
                <v-card-text>
                    Настройки авторизации...
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="su">
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
import { webFrame, shell } from 'electron';
import { APP_DATA } from '@/../files';

export default {
    name: 'SettingsContent',
    // props: 'settings',
    data() {
        return {
            appDataPath: APP_DATA
        };
    },

    computed: {
        zoom: {
            get() {
                return webFrame.getZoomFactor();
            },
            set(nval) {
                webFrame.setZoomFactor(nval);
            }
        },

        darkTheme: {
            get() { return this.$store.state.settings.darkTheme; },
            set(value) {
                this.$store.commit('settings/setTheme', { dark: value });
            }
        },

        availableZooms() {
            return new Array(Math.floor((300 - 100) / 20) + 1) // 100..300 step 20
                .fill(null)
                .map((_, i) => i * 20 + 100)
                .map(z => ({
                    label: z + '%',
                    value: z / 100
                }));
        },

        su() {
            return this.$store.state.user.superuser && false;
        }
    },

    methods: {
        openAppDataFolder() {
            shell.openItem(APP_DATA);
        }
    }
};
</script>
