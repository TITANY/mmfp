module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    globals: {
        __static: true
    },
    plugins: [
        'html'
    ],
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'curly': 0,
        // allow async-await
        'generator-star-spacing': 0,
        'indent': ['error', 4],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1, maxBOF: 0 }],
        'one-var': 0,
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }]
    }
}
