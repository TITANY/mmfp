import getShown from './shown';

export default class Group {
    constructor({ label, show }, id) {
        this.id = id;
        this.label = label;
        this.show = show;
        this.content = [];
    }

    add(question) {
        this.content.push(question);
        question.group = this;
    }

    render() {
        const rendered = this.content
            .map(q => q.render());

        return getShown(this.show, rendered);
    }
}
