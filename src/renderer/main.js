import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuetify, {
    theme: {
        primary: colors.teal.base
    }
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
