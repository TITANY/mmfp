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

        logIn(state, { name }) {
            state.user = {
                loggedIn: true,
                name
            };
        }
    }
});
