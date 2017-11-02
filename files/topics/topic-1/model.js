/* eslint-disable */

({
    description: {
        input: {
            v1: String,
            v2: Number,
            v3: {
                'op1': 'Вариант 1',
                'op2': 'Вариант 2'
            }
        },

        output: {
            depFn: {
                type: 'graph',
                name: 'График зависимости'
            },
            result: {
                type: 'value',
                name: 'Значение'
            }
        }
    },

    model: function (inputs) {
        var output = {};
        output.depFn = null;
        output.result = inputs.v2;
        return output;
    }
})
