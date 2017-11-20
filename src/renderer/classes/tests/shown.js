import shuffle from 'lodash/shuffle';

export default function getShown(shownConfig, entities, alreadyShown = 0) {
    let count = entities.length;
    if (!shownConfig.all) {
        const { min, max } = shownConfig;
        count = Math.floor(Math.random() * (max - min + 1)) + min;
        count -= alreadyShown;
    }
    count = Math.max(0, Math.min(count, entities.length));

    return shuffle(entities).slice(0, count);
}
