<template>
    <div id="app">
        <v-app>
            <v-navigation-drawer
                persistent
                clipped
                app
                v-model="drawer"
            >
                <v-list>
                    <template v-for="(item, i) in sidemenu">
                        <v-list-tile
                            v-if="item.type === 'item'"
                            router
                            :to="item.to"
                            :key="i"
                            exact
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
                            :data="getData(item.data)"
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
            </v-toolbar>
            <main app>
                <v-content>
                    <v-container fluid>
                        <v-slide-y-transition mode="out-in">
                            <router-view></router-view>
                        </v-slide-y-transition>
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
import sidemenu from './sidemenu';

import UserInfo from './components/sidemenu/UserInfo';

export default {
    name: 'mmfp',
    data: () => ({
        drawer: true,
        right: true,
        title: 'MMFP',

        user: {
            name: null,
            loggedIn: false
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
            return props.map(prop => this[prop]);
        }
    },

    mounted: function () {
        eventBus.$on('user-login', ({ username }) => {
            this.user.name = username;
            this.user.loggedIn = true;
            this.$router.push('/theory');
        });
        eventBus.$on('open-link', ({ url }) => openLink(url));
    },

    components: { UserInfo }
};
</script>

<style lang="stylus">
@import './assets/stylus/main.styl';
</style>


<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
/* Global CSS */
</style>
