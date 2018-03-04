const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const VENDER_DEST_FOLDER = './static/vendor'; // отсчет от /dist

const extractLESS = new ExtractTextPlugin(NODE_ENV === 'production' ? '[name].[chunkhash].css' : '[name].css'/*, {allChunks: true}*/);

const COPY_FILES = [

    { from: 'public/index.html' }

    // CSS
    {from: 'node_modules/bootstrap/dist/css/',  to: './static/style/css/'},
    {from: 'node_modules/font-awesome/css/',            to: './static/style/css/'},
    {from: 'public/style/css/',                         to: './static/style/css/'},

    // Fonts
    {from: 'node_modules/bootstrap/dist/fonts/',    to: './static/style/fonts/'},
    {from: 'node_modules/font-awesome/fonts/',              to: './static/style/fonts/'},
    {from: 'public/style/fonts/',                           to: './static/style/fonts/'},

    // Images
    {from: 'public/style/images/',    to: './static/style/images/'},

    // JS
    {from: 'node_modules/react/dist/',                      to: './static/js/lib/'},
    {from: 'node_modules/react-dom/dist/',                  to: './static/js/lib/'},
    {from: 'node_modules/redux/dist/',                      to: './static/js/lib/'},
    {from: 'node_modules/react-redux/dist/',                to: './static/js/lib/'},
    {from: 'node_modules/react-router/umd/',                to: './static/js/lib/'},
    {from: 'node_modules/redux-logger/dist/index.js',       to: './static/js/lib/redux-logger.js'},
    {from: 'node_modules/redux-logger/dist/index.min.js',   to: './static/js/lib/redux-logger.min.js'}
];

module.exports = {
    //watchOptions: { aggregateTimeout: 1000, poll: 200 },
    devtool: 'source-map',
    entry: {
        'static/app': './src/app'
    },
    output: {
        path: path.join(__dirname, 'target'),
        filename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
        publicPath: '/static/'
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux': 'Redux',
        'react-redux': 'ReactRedux',
        'react-router': 'ReactRouter',
        'redux-logger': 'reduxLogger',
        'react/lib/ReactTransitionGroup': 'React.addons.TransitionGroup',
        'react/lib/ReactCSSTransitionGroup': 'React.addons.CSSTransitionGroup',
    },

    resolve: {
        root: [
            path.resolve('./custom-modules'),
        ],
        extensions: ['', '.js', '.json']
    },

    plugins: [
        new webpack.ProvidePlugin({
            "React": "react"
        }),
        new CopyWebpackPlugin(COPY_FILES),
        extractLESS
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: [
                    path.resolve(__dirname, 'custom-modules'),
                    path.join(__dirname, 'src')
                ],
                exclude:path.resolve(__dirname, "node_modules"),
                query: {
                    compact: false,
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ["transform-decorators-legacy"]
                }
            },
            { test: /\.less$/i, loader: extractLESS.extract(['css', 'autoprefixer', 'less?noIeCompat']) },
            { test: /\.css$/, loader: 'style-loader!css-loader' }
            {
                test: /\.(woff|woff2)(\?.*)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },{
                test: /\.(ttf|eot|svg)(\?.*)?$/,
                loader: "file-loader"
            }
        ]
    }
};
