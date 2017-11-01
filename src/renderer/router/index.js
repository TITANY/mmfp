import Vue from 'vue';
import Router from 'vue-router';
import { protect } from '../utils/protect';


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
            redirect: protect('testing-real')
        },
        {
            path: '/testing-real',
            name: 'testing-real',
            component: require('@/components/Testing')
        },
        {
            path: '/model',
            name: 'model',
            redirect: protect('model-real')
        },
        {
            path: '/model-real',
            name: 'model-real',
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
