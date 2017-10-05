export default [
    { type: 'item', label: 'Войти', to: '/login', icon: 'input', unknownOnly: true },
    { type: 'component', component: 'user-info', protected: true },
    { type: 'item', label: 'Теория', to: '/theory', icon: 'library_books', protected: true },
    { type: 'item', label: 'Тестирование', to: '/testing', icon: 'check', protected: true },
    { type: 'item', label: 'Моделирование', to: '/model', icon: 'multiline_chart', protected: true },
    { type: 'item', label: 'Выход', to: '/exit', icon: 'close' }
];
