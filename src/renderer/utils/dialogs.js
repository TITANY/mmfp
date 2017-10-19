export const createConfirmation = (content, title = 'Вы уверены, что хотите продолжить?') => ({
    content,
    title,
    show: true,
    actions: [
        { action: 'no', label: 'Нет', closes: true },
        { action: 'yes', label: 'Да', style: { class: ['indigo', 'white--text'], flat: false } }
    ],
    showTitle: true,
    persistent: true,
    isComponent: false
});

export const createComponentAlert = (componentName, title, { bind, width = '50%' } = {}) => ({
    title,
    show: true,
    actions: [
        { action: 'close', label: 'Готово', closes: true, style: { class: ['indigo', 'white--text'], flat: false } }
    ],
    showTitle: true,
    persistent: true,
    isComponent: true,
    componentName,
    bind,
    width
});
