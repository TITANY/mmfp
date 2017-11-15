import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import App from './App';
import router from './router';
import store from './vuex';

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
