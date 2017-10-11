import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'welcome-view',
            component: require('@/components/WelcomeView')
        },
        {
            path: '/login',
            name: 'login',
            component: require('@/components/Login')
        },
        {
            path: '/theory',
            name: 'theory',
            component: require('@/components/Theory')
        },
        {
            path: '/testing',
            name: 'testing',
            component: require('@/components/Testing')
        },
        {
            path: '/model',
            name: 'model',
            component: require('@/components/Model')
        },
        {
            path: '/dummy',
            beforeEnter: (to, from, next) => {
                next(Object.assign({}, from));
            }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
