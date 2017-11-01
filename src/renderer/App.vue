<template>
    <div id="app">
        <v-app>
            <v-navigation-drawer
                clipped
                app
                v-model="drawer"
            >
                <v-list>
                    <template v-for="(item, i) in sidemenu">
                        <v-list-tile
                            v-if="item.type === 'item'"
                            
                            :to="item.to || '/dummy'"
                            :key="i"
                            @click.native="item.action && sidemenuAction(item.action)"
                            
                        >
                            <v-list-tile-action>
                                <v-icon v-html="item.icon"></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="item.label"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>

                        <component
                            v-if="item.type === 'component'"
                            :is="item.component"
                            v-bind="getData(item.data)"
                        >
                            {{ item.content || '' }}
                        </component>
                    </template>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar
                fixed
                dark
                app
                clipped-left
                class="teal darken-1"
            >
                <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title v-text="title"></v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon @click.native="openTopicsList"><v-icon>list</v-icon></v-btn>
                <v-btn icon @click.native="openSettings"><v-icon>settings</v-icon></v-btn>

            </v-toolbar>
            <main app>
                <v-content>
                    <v-container fluid>
                        <v-slide-y-transition mode="out-in">
                            <router-view></router-view>
                        </v-slide-y-transition>
                        <mmfp-dialog
                            v-for="(d, i) in dialogs"
                            :key="i"
                            v-model="d.show"
                            :actions="d.actions"
                            :title="d.showTitle"
                            :persistent="d.persistent"
                            :width="d.width"
                            @result="onDialogResult(i, $event)"
                        >
                            <component v-if="d.isComponent" :is="d.componentName" v-bind="this[d.bind]"></component>
                            <div v-else v-text="d.content"></div>
                            <div v-text="d.title" slot="title" class="headline"></div>
                        </mmfp-dialog>
                    </v-container>
                </v-content>
            </main>
            <v-footer fixed app dark class="teal lighten-2">
                <v-spacer></v-spacer>
                <span class="white--text">&copy; 2017, TITANY</span>
            </v-footer>
        </v-app>
    </div>
</template>

<script>
import openLink from './utils/openlink';
import eventBus from './utils/eventbus';
import cmd from './utils/cmd';
import sidemenu from './sidemenu';
import { createConfirmation, createComponentAlert } from './utils/dialogs';
import { changeLoggedIn } from './utils/protect';

import UserInfo from './components/sidemenu/UserInfo';
import MmfpDialog from './components/MmfpDialog';
import TopicsList from './components/TopicsList';
import SettingsContent from './components/SettingsContent';


export default {
    name: 'mmfp',
    data: () => ({
        drawer: true,
        right: true,
        title: 'Математическое моделирование физических процессов',

        user: {
            name: null,
            loggedIn: false
        },

        dialogs: [],

        topics: {
            selected: -1
        },

        settings: {
            logs: []
        }
    }),
    computed: {
        sidemenu: function () {
            const loggedIn = this.user.loggedIn;
            return sidemenu.filter(item => {
                if (item.protected)
                    return loggedIn;
                if (item.unknownOnly)
                    return !loggedIn;
                return true;
            });
        }
    },
    methods: {
        open: link => openLink(link),
        getData: function (props) {
            const result = {};
            props.forEach(prop => {
                result[prop] = this[prop];
            });
            return result;
        },

        sidemenuAction: function (action) {
            if (typeof action === typeof '') {
                cmd(action);
            } else {
                if (action.confirm) {
                    this.createDialog(
                        createConfirmation('Вы действительно хотите закрыть приложение?', 'Выход'),
                        result => {
                            if (result === 'yes') {
                                cmd(action.cmd, action.args);
                            }
                        }
                    );
                } else {
                    // without confirmation
                    cmd(action.cmd, action.args);
                }
            }
        },

        createDialog: function (params, handler) {
            this.dialogs.push(params);
            this.dialogCallbacks.push(handler);
        },

        removeDialog: function (index) {
            this.dialogs.splice(index, 1);
            this.dialogCallbacks.splice(index, 1);
        },

        onDialogResult: function (index, result) {
            this.dialogCallbacks[index](result);
        },

        openTopicsList: function () {
            this.createDialog(createComponentAlert('topics-list', 'Список тем'), () => {});
        },

        openSettings: function () {
            this.createDialog(createComponentAlert('settings-content', 'Настройки'), () => {});
        }
    },

    mounted: function () {
        eventBus.$on('user-login', ({ username }) => {
            this.user.name = username;
            this.user.loggedIn = true;
            this.$router.push('/theory');
        });
        eventBus.$on('open-link', ({ url }) => openLink(url));

        eventBus.$on('navigate', event => {
            this.$router.push(event);
        });

        // non-reactive data
        // callbacks:
        this.dialogCallbacks = [];
    },

    components: { UserInfo, MmfpDialog, TopicsList, SettingsContent },

    watch: {
        user: {
            handler() {
                changeLoggedIn(this.user.loggedIn);
            },
            deep: true
        }
    }
};
</script>

<style lang="stylus">
@import './assets/stylus/main.styl';
</style>
