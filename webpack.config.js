const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: {
        
        'main': './js/main.js',
    },
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['latest', { modules: false }],
                        "stage-0"
                    ],
                },
            },
        ],
    },
    plugins: [
        // new MinifyPlugin()
    ]
};