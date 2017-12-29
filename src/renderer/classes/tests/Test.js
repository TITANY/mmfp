import shuffle from 'lodash/shuffle';
import Group from './Group';
import Question from './Question';
import Scores from './Scores';
import cloneDeep from 'lodash/cloneDeep';

export default class Test {
    constructor({
        meta: {
            description = '(нет описания)',
            scores,
            groups, // = [{ label: '(default)', show: { all: true } }],
            changed_at,
            changed_by
        },
        content
    }) {
        this.description = description;
        this.scores = new Scores(scores);
        this.groups = groups.map((data, id) => new Group(data, id));
        this.changedAt = new Date(changed_at); // eslint-disable-line camelcase
        this.changedBy = changed_by; // eslint-disable-line camelcase

        this.content = content.map(data => {
            const q = Question.create(data);
            this.groups[data.group || 0].add(q);
            return q;
        });
    }

    render() {
        return {
            meta: {
                description: cloneDeep(this.description),
                scores: cloneDeep(this.scores),
                changedAt: new Date(this.changedAt.getTime()),
                changedBy: this.changedBy
            },

            content: shuffle(
                this.groups
                    .map(g => g.render())
                    .reduce((all, nextGroup) => all.concat(nextGroup), [])
            )
        };
    }

    check(data) {
        const results = data.map(({uuid, shown, given}) => {
            const q = this.content.filter(q => q.uuid === uuid)[0] || null;
            if (!q) {
                console.error('Question not found: ' + uuid);
                return NaN;
            } else {
                return q.check(shown, given);
            }
        });
        const score = results.reduce((sum, next) => sum + next, 0);
        return {
            title: this.scores.name(score),
            score
        };
    }

    serialize() {
        return {
            meta: {
                description: this.description,
                changed_by: this.changedBy,
                changed_at: this.changedAt,
                scores: this.scores.serialize(),
                groups: this.groups.map(g => g.serialize())
            },

            content: this.content.map(q => q.serialize())
        };
    }

    write(file) {
        throw new TypeError('Basic test cannot write!');
    }

    addQuestion(data) {
        const q = Question.create(data);
        this.groups[0].add(q);
        this.content.push(q);
    }

    addGroup(data) {
        this.groups.push(new Group(data, this.groups.length));
    }
}

const registry = {};

Test.register = (name, T) => {
    registry[name] = T;
};

Test.read = (type, content) => {
    const T = registry[type] || Test;
    return new T(content);
};

Test.write = (type, content, file) => {
    const T = registry[type] || Test;
    return new T(content).write(file);
};
