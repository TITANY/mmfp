import { Store } from 'vuex';

export default () => new Store({
    state: {
        selectedTopic: null
    },

    mutations: {
        selectTopic(state, { topic }) {
            state.selectedTopic = topic;
        }
    }
});
