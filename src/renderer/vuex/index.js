import { Store } from 'vuex';

export default () => new Store({
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
        },

        settings: {}
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
        }
    }
});
