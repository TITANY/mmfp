import { Store } from 'vuex';

export default () => new Store({
    state: {
        selectedTopic: null,

        tests: {
            finished: false,
            result: null
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
        }
    }
});
