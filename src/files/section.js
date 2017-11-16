import path from 'path';
import { readText } from './fs';


export default function readSection(section, workdir) {
    if (!section) {
        return Promise.resolve(null);
    }

    const testsFilePath = path.resolve(workdir, section.file);
    // TODO: use section.check to check file sum
    return readText(testsFilePath)
        .then(content => ({
            content,
            type: section.type,
            check: true
        }))
    ;
}
