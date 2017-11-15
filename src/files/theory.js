import path from 'path';
import { readText } from './fs';


export default function readTheory(topic, workdir) {
    const theory = topic.theory;
    if (!theory) {
        return Promise.resolve(null);
    }

    const theoryFilePath = path.resolve(workdir, theory.file);
    // TODO: use theory.check to check file sum
    return readText(theoryFilePath)
        .then(content => ({
            content,
            type: theory.type,
            check: true
        }))
    ;
}
