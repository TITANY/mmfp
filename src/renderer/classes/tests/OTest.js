import Test from './Test';
import { writeJson } from '../../../files/fs';

export default class OTest extends Test {
    constructor(sringFileContent) {
        const parsed = JSON.parse(sringFileContent);
        super(parsed);
    }

    write(file) {
        const data = this.serialize();
        console.log(file);
        return writeJson(file, data);
    }
}

Test.register('obfuscated_test', OTest);
