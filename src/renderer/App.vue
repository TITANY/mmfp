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
                    </template>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar
                fixed
                dark
                clipped-left
                class="teal darken-1"
            >
                <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title v-text="title"></v-toolbar-title>
            </v-toolbar>
            <main>
                <v-container fluid>
                    <v-layout align-start justify-stretch fill-height>
                        <v-slide-y-transition mode="out-in">
                            <router-view></router-view>
                        </v-slide-y-transition>
                    </v-layout>
                </v-container>
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
import sidemenu from './sidemenu';

export default {
    name: 'mmfp',
    data: () => ({
        drawer: true,
        sidemenu,
        right: true,
        title: 'MMFP'
    }),
    methods: {
        open: link => openLink(link)
    }
};
</script>

<style lang="stylus">
@import './assets/stylus/main.styl';
</style>


<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
/* Global CSS */
</style>
