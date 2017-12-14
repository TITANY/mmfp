import cloneDeep from 'lodash/cloneDeep';
import shuffle from 'lodash/shuffle';
import getShown from './shown';
import diff from 'lodash/difference';
import intersect from 'lodash/intersection';


const types = {
    simple: (given, correct, all, { win, lose }) => {
        if (given.length !== correct.length) return lose;
        given.sort();
        correct.sort();
        for (let i = 0; i < given.length; i++) {
            if (given[i] !== correct[i])
                return lose;
        }
        return win;
    },
    // eslint-disable-next-line camelcase
    vdist: (given, correct, all, { match, false_match, false_mismatch = false_match }) => {
        const falseMatches = diff(given, correct);
        const falseMismatches = diff(correct, given);
        const matches = intersect(correct, given);
        return (
            false_match    * falseMatches.length +      // eslint-disable-line camelcase, no-multi-spaces
            false_mismatch * falseMismatches.length +   // eslint-disable-line camelcase, no-multi-spaces
            match          * matches.length             // eslint-disable-line camelcase, no-multi-spaces
        );
    }
};

const split = (arr, cond) => arr.reduce(
    (result, next) => {
        if (cond(next)) {
            result[0].push(next);
        } else {
            result[1].push(next);
        }
        return result;
    },
    [[], []]
);

const s4 = () => Math
    .floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
const guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

export default class Question {
    constructor(data) {
        const {
            answers,
            check_type: checkType,
            points,
            question,
            shown_answers: shown,
            shown_correct: shownCorrect = { all: true },
            type
        } = data;
        const correct = data.await;

        Object.assign(this, {
            checkType,
            points,
            question,
            correct,
            shown,
            shownCorrect,
            type,
            group: null
        });
        this.uuid = guid();

        this.answers = answers.map((label, id) => ({
            label,
            id,
            correct: this.isCorrect(id)
        }));
    }

    render() {
        const [correct, incorrect] = split(
            this.answers,
            ({ correct }) => correct
        );

        const shownCorrect = getShown(this.shownCorrect, correct);
        const shownIncorrect = getShown(this.shown, incorrect, shownCorrect.length);

        return {
            uuid: this.uuid,
            question: this.question,
            type: this.type,
            answers: cloneDeep(shuffle(shownCorrect.concat(shownIncorrect))),

            initialAnswer: this.getInitialAnswer()
        };
    }

    isCorrect(id) {
        return this.correct.includes(id);
    }

    getInitialAnswer() {
        return [];
    }

    check(shownIds, givenIds) {
        const correctIds = shownIds.filter(id => this.isCorrect(id));

        const checker = types[this.checkType];
        if (checker) {
            return checker(givenIds, correctIds, shownIds, this.points);
        } else {
            throw new TypeError('Unknown test type: ' + this.checkType);
        }
    }

    serialize() {
        const data = {
            answers: this.answers.map(({ label }) => label),
            check_type: this.checkType,
            points: this.points,
            question: this.question,
            shown_answers: this.shown,
            shown_correct: this.shownCorrect,
            type: this.type,
            'await': this.correct
        };
        return data;
    }
}

const registry = {};
Question.register = (name, T) => {
    registry[name] = T;
};

Question.create = (data) => {
    const T = registry[data.type] || Question;
    return new T(data);
};

//
// more specific classes
//

class SingleQuestion extends Question {
    constructor(data) {
        if (typeof data.await !== typeof 0)
            data.await = -1;
        super(data);
    }

    isCorrect(id) {
        return this.correct === id;
    }
    getInitialAnswer() {
        return -1;
    }
    check(shown, given) {
        return super.check(shown, [given]);
    }
}
Question.register('single', SingleQuestion);

class MultipleQuestion extends Question {
    constructor(data) {
        if (!Array.isArray(data.await)) {
            data.await = [];
        }
        super(data);
    }
}
Question.register('multiple', MultipleQuestion);
