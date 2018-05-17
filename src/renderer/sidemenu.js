const quit = (component, remote) => {
    remote.getCurrentWindow().close();
};
const logout = (component, remote) => {
    component.$store.commit('logout');
};

export default [
    { type: 'item', label: 'Войти', to: '/login', icon: 'input', unknownOnly: true },
    { type: 'component', component: 'user-info', protected: true, data: ['user'] },
    { type: 'item', label: 'Теория', to: '/theory', icon: 'library_books' },
    { type: 'item', label: 'Тестирование', to: '/testing', icon: 'done_all', protected: true },
    { type: 'item', label: 'Редактор', to: '/editor', icon: 'mode_edit', superuser: true },
    { type: 'item', label: 'Моделирование', to: '/model', icon: 'multiline_chart', protected: true },

    {
        type: 'item',
        label: 'Выход из системы',
        action: {
            fn: logout,
            confirm: ['Результаты тестирования и моделирования будут забыты!', 'Деавторизация']
        },
        icon: 'exit_to_app',
        protected: true
    },
    {
        type: 'item',
        label: 'Закрыть приложение',
        action: {
            fn: quit,
            confirm: ['Вы действительно хотите закрыть приложение?', 'Выход']
        },
        icon: 'close'
    }
];
