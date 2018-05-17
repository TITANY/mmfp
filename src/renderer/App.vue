<template>
    <div id="app">
        <v-app :dark="darkTheme" :light="!darkTheme">
            <v-navigation-drawer
                fixed
                clipped
                app
                enable-resize-watcher
                v-model="drawer"
            >
                <v-list>
                    <template v-for="(item, i) in sidemenu">
                        <v-slide-y-transition mode="out-in" :key="i + '_transition'">
                            <v-list-tile
                                v-if="item.type === 'item'"

                                :to="item.to || '/dummy'"
                                :key="i + '_' + item.to"
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
                                :key="i + '_' + item.component"
                                v-bind="getData(item.data)"
                            >
                                {{ item.content || '' }}
                            </component>
                        </v-slide-y-transition>
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
                <v-tooltip bottom>
                    <v-btn slot="activator" icon to="/" exact><v-icon>home</v-icon></v-btn>
                    <span>Начальный экран</span>
                </v-tooltip>
                <v-toolbar-title v-text="title"></v-toolbar-title>

                <v-spacer></v-spacer>

                <v-tooltip bottom>
                    <v-btn slot="activator" icon @click="openTopicsList"><v-icon>list</v-icon></v-btn>
                    <span>Список тем</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <v-btn slot="activator" icon @click="openSettings"><v-icon>settings</v-icon></v-btn>
                    <span>Настройки</span>
                </v-tooltip>

            </v-toolbar>
            <v-content app>
                <v-container fluid>
                    <v-slide-y-transition mode="out-in">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
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
                        <component v-if="d.isComponent" :is="d.componentName" v-bind="getData(d.bind || [])"></component>
                        <div v-else v-text="d.content"></div>
                        <div
                            v-if="d.showTitle"
                            v-text="d.title"
                            slot="title"
                            class="headline"
                        ></div>
                    </mmfp-dialog>

                    <mmfp-dialog
                        v-model="topicsListDialog.shown"
                        :actions="topicsListDialog.actions"
                        :title="true"
                        presistent
                        width="50%"
                        @result="onTopicsResult"
                    >
                        <div slot="title" class="headline">{{ topicsListDialog.title }}</div>
                        <topics-list
                            :value="preselectedId"
                            @input="onTopicsInput"
                        ></topics-list>
                    </mmfp-dialog>
                </v-container>
            </v-content>
            <v-footer fixed app dark class="teal lighten-2">
                <v-spacer></v-spacer>
                <span class="white--text">&copy; 2017-2018, TITANY</span>
            </v-footer>
        </v-app>
        Hello
    </div>
</template>
<script>
import { remote } from 'electron';
import openLink from './utils/openlink';
import eventBus from './utils/eventbus';
import sidemenu from './sidemenu';
import {
    createComponent,
    confirmation,
    ACTION_CANCEL,
    ACTION_APPLY
} from './utils/dialogs';
import { changeLoggedIn } from './utils/protect';

import UserInfo from './components/sidemenu/UserInfo';
import MmfpDialog from './components/MmfpDialog';
import TopicsList from './components/TopicsList';
import SettingsContent from './components/SettingsContent';

const noop = () => {};

export default {
    name: 'MmfpApp',
    data: () => ({
        drawer: true,
        right: true,
        title: 'Математическое моделирование физических процессов',

        dialogs: [],

        preSelectedTopic: null,

        topicsListDialog: {
            shown: false,
            actions: [ ACTION_CANCEL, ACTION_APPLY ],
            title: 'Список тем'
        },

        settings: {
            logs: []
        }
    }),
    computed: {
        sidemenu: function () {
            const loggedIn = this.user.loggedIn;
            const su = this.user.superuser;
            return sidemenu.filter(item => {
                if (item.superuser) {
                    return su;
                }
                if (item.protected) {
                    return loggedIn;
                }
                if (item.unknownOnly) {
                    return !loggedIn;
                }
                return true;
            });
        },

        selectedTopic() {
            return this.$store.state.selectedTopic;
        },

        user() {
            return this.$store.state.user;
        },

        preselectedId() {
            if (this.preSelectedTopic === null) {
                return null;
            }
            return this.preSelectedTopic.meta.id;
        },

        darkTheme() {
            return this.$store.state.settings.darkTheme;
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
            if (action.confirm) {
                this.createDialog(
                    confirmation(action.confirm[0], action.confirm[1] || 'Подтвердите действие'),
                    result => {
                        if (result === 'yes') {
                            action.fn(this, remote);
                            return true;
                        }
                    }
                );
            } else {
                // without confirmation
                action.fn(this, remote);
            }
        },

        createDialog: function (params, handler = noop) {
            this.dialogs.push(params);
            this.dialogCallbacks.push(handler);
        },

        removeDialog: function (index) {
            this.dialogs.splice(index, 1);
            this.dialogCallbacks.splice(index, 1);
        },

        onDialogResult: function (index, result) {
            const close = this.dialogCallbacks[index](result);
            if (close === true) {
                this.removeDialog(index);
            }
        },

        openTopicsList: function () {
            this.topicsListDialog.shown = true;
        },

        onTopicsResult(event) {
            this.topicsListDialog.shown = false;
            if (event === 'apply') {
                if (this.preSelectedTopic === null) return;
                const topic = this.preSelectedTopic;
                this.title = topic.meta.name;

                this.$store.commit('selectTopic', { topic });
            } else {
                this.preSelectedTopic = this.selectedTopic;
            }
        },
        onTopicsInput(event) {
            this.preSelectedTopic = event;
        },

        openSettings: function () {
            this.createDialog(createComponent('settings-content', { title: 'Настройки' }), () => {});
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

        // this.title = process.cwd();

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
