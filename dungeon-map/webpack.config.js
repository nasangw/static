const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    entry: {
        index: [
            './src/js/app.js',
            './src/sass/app.scss',
        ]
    },
    devServer: {
        historyApiFallback: true,
        inline: true, 
        hot: true,
        contentBase: './public',
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        // path: path.resolve(__dirname, 'public'),
        // filename: 'bundle.js', 
    },
    mode: 'development',
    // devtool: '#inline-source-map',
    // devtool: "cheap-module-eval-source-map",
    // devtool: 'source-map',
    resolve: {
        modules: ["./node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         // fallback은 아래 플러그인이 작동하지 않을 경우 style-loader가 작동함을 의미한다.
            //         fallback: 'style-loader',
            //         use: [ 'css-loader', 'sass-loader', 'postcss-scss' ]
            //     })
            // },
            { 
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => autoprefixer({
                            browsers: ['last 3 versions', '> 1%']
                        })
                    }
                }, 'sass-loader'])
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new ExtractTextPlugin(path.resolve(__dirname, 'public/[name].css')),
        new ExtractTextPlugin('./[name].css'),
        // new ExtractTextPlugin({
        //     path: path.join(__dirname, 'public'),
        //     filename: '[name].css',
            // filename: path.resolve(__dirname, 'public/[name].css'), 
            // allChunks: true,
        // }),
        new UglifyJSPlugin(),
    ]
}