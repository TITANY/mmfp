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
                <v-select
                    :items="availableZooms"
                    v-model="zoom"
                    prepend-icon="search"
                    label="Масштаб интерфейса"
                    item-text="label"
                    item-value="value"
                ></v-select>
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
import { webFrame } from 'electron';

export default {
    name: 'settings-content',
    // props: 'settings',
    data() {
        console.log(webFrame.getZoomFactor());
        return {};
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

        availableZooms() {
            return new Array(Math.floor((300 - 100) / 20) + 1) // 100..300 step 20
                .fill(null)
                .map((_, i) => i * 20 + 100)
                .map(z => ({
                    label: z + '%',
                    value: z / 100
                }));
        }
    }
};
</script>
