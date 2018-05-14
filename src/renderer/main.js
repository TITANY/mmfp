/* eslint import/first: 0 */
// require('@/assets/mathjax/tex');
import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuetify);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
