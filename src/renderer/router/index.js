import Vue from 'vue';
import Router from 'vue-router';

import WelcomeView from '@/components/WelcomeView';
import Login from '@/components/Login';
import TheoryTab from '@/components/TheoryTab';
import Testing from '@/components/Testing';
import Model from '@/components/Model';
import EditorTab from '@/components/EditorTab';


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'welcome-view',
            component: WelcomeView
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/theory',
            name: 'theory',
            component: TheoryTab
        },
        {
            path: '/testing',
            name: 'testing',
            component: Testing
        },
        {
            path: '/model',
            name: 'model',
            component: Model
        },
        {
            path: '/editor',
            name: 'editor',
            component: EditorTab
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
