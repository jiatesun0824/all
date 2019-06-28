var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require("webpack")
var ImageminPlugin = require('imagemin-webpack-plugin').default
const vuxLoader = require('vux-loader')
var TransformModulesPlugin = require('webpack-transform-modules-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const webpackConfig = {
    // devtool: 'eval', // 打包工具，上线时去掉
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'normalize': '../node_modules/normalize.scss/normalize.scss',
            'cube-ui': 'cube-ui/lib',
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'api': path.resolve(__dirname, '../src/api'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'common': path.resolve(__dirname, '../src/common'),
            'components': path.resolve(__dirname, '../src/components'),
            'styles': path.resolve(__dirname, '../src/styles'),
            'router': path.resolve(__dirname, '../src/router'),
            'store': path.resolve(__dirname, '../src/store'),
            'views': path.resolve(__dirname, '../src/views')
        }
    },
    module: {
        rules: [
            // {
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   enforce: 'pre',
            //   include: [resolve('src'), resolve('test')],
            //   options: {
            //     formatter: require('eslint-friendly-formatter')
            //   }
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp3)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: utils.assetsPath('audio/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        // Make sure that the plugin is after any plugins that add images
        new ImageminPlugin({
            // disable: process.env.NODE_ENV !== 'production',
            pngquant: {
                quality: '95-100'
            }
        }),
        new TransformModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common.js'), 　　new webpack.ProvidePlugin({　　　　 jQuery: "jquery", 　　　　$: "jquery"　　 }),

    ]
}
module.exports = vuxLoader.merge(webpackConfig, {
    plugins: [{
            name: 'vux-ui'
        },
        {
            name: 'less-theme',
            path: 'src/styles/theme.less'
        }
    ]
})