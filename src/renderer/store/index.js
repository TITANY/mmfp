import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
    modules,
    strict: process.env.NODE_ENV !== 'production',

    state: {
        selectedTopic: null,

        tests: {
            finished: false,
            result: null
        },

        user: {
            loggedIn: false,
            superuser: false,
            name: null
        }
    },

    mutations: {
        selectTopic(state, { topic }) {
            state.selectedTopic = topic;
        },

        finishTests(state, { result }) {
            state.tests = {
                finished: true,
                result
            };
        },

        logIn(state, { name, superuser = false }) {
            state.user = {
                loggedIn: true,
                superuser,
                name
            };
        },

        logout(state) {
            state.user = {
                loggedIn: false,
                superuser: false,
                name: null
            };
            state.tests = {
                finished: false,
                result: null
            };
        }
    }
});
