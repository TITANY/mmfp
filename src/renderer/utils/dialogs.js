export const ACTION_DONE = {
    action: 'close',
    label: 'Готово',
    closes: true,
    style: { class: ['primary', 'white--text'], flat: false }
};

export const ACTION_YES = {
    action: 'yes',
    label: 'Да',
    style: { class: ['primary', 'white--text'], flat: false }
};
export const ACTION_NO = { action: 'no', label: 'Нет', closes: true };

export const ACTION_CANCEL = { action: 'cancel', label: 'Отмена', closes: true };
export const ACTION_APPLY = {
    action: 'apply',
    label: 'Применить',
    closes: true,
    style: { class: ['primary', 'white--text'], flat: false }
};

export const create = ({
    content,
    title = '',
    show = true,
    actions = [ACTION_DONE],
    showTitle = true,
    persistent = true,
    width = '25%',
    isComponent,
    componentName,
    bind
} = {}) => ({
    content, title, show, actions, showTitle, persistent, width, isComponent, componentName, bind
});

export const createText = ops => create(Object.assign({}, ops, { isComponent: false }));
export const createComponent = (name, ops) => create(Object.assign(
    { width: '50%' },
    ops,
    { isComponent: true, componentName: name }
));

export const actionsYesNo = ops => Object.assign({}, ops, { actions: [ACTION_NO, ACTION_YES] });
export const actionsApplyCancel = ops => Object.assign({}, ops, { actions: [ACTION_CANCEL, ACTION_APPLY] });

export const confirmation = (content, title, ops = {}) => actionsYesNo(createText(Object.assign(
    {},
    ops,
    { title, content }
)));
