export default class Scores {
    constructor(scores) {
        this.data = scores.sort((a, b) => {
            if (a.default) return -1;
            if (b.default) return 1;
            return a.starts_from - b.starts_from;
        });
    }

    name(score) {
        let title = null;
        for (let i = 0; i < this.data.length; i++) {
            const s = this.data[i];
            if (s.default) {
                title = s.title;
                continue;
            } else {
                if (s.starts_from > score) {
                    break;
                } else {
                    title = s.title;
                }
            }
        }
        return title;
    }
}
