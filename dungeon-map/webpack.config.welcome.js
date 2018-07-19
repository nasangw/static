const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '_src/js/service/welcome_2018/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    "presets": [
                        [
                            "env", {
                                "targets": {
                                    "browsers": ["last 2 versions", "ie >= 10"]
                                }
                            }
                        ]
                    ]
                }
            }
            }
        ]
    }
    
}