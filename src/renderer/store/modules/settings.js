const state = {
    darkTheme: false
};

const mutations = {
    setTheme(state, { dark }) {
        state.darkTheme = dark;
    }
};

export default {
    namespaced: true,
    state,
    mutations
};
