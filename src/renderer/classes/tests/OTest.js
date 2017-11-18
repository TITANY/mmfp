import Test from './Test';

export default class OTest extends Test {
    constructor(sringFileContent) {
        const parsed = JSON.parse(sringFileContent);
        super(parsed);
    }
}

Test.register('obfuscated_test', OTest);
