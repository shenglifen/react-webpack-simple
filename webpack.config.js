const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");//html打包功能
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");//把打包到js里面到css文件拆分
const ENV = process.env.NODE_ENV || 'development';
const ASSET_PATH = process.env.ASSET_PATH || '/';
const IS_PROD = ENV === 'production';
const pkg = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VERSION = `${pkg.version}`;
const SOURCE_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'build');
const CLIENT_DIR = path.join(OUTPUT_DIR, VERSION);
module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        path: CLIENT_DIR,
        filename: 'assets/js/[name].[hash:8].js',
        publicPath: ASSET_PATH,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                include: SOURCE_DIR,
                use: {
                    loader: 'babel-loader',
                },
            }, {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {loader: 'css-loader', options: {minimize: true}},
                        {loader: 'postcss-loader', options: {minimize: true}}
                    ]
                })
            }, {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {loader: "css-loader", options: {minimize: true}},
                        {loader: "less-loader", options: {minimize: true}},
                        {loader: "postcss-loader", options: {minimize: true}},
                    ]
                })
            }, {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,// 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(OUTPUT_DIR),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在根目录下创建一个index.html页面当做模板来用
            template: 'template/index.html',
            hash: true,// 会在打包好的bundle.js后面加上hash串
            title: "React-webpack",
        }),
        new ExtractTextWebpackPlugin({
            filename: 'assets/css/[name].[hash:8].css'
        })
    ],
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './build',
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
    },
    mode: ENV,
    target: "web",
    context: SOURCE_DIR,
    resolve: {
        //别名
        alias: {
            $: 'jquery',
        },
        extensions: [".ts", ".tsx", ".js", ".json"]

    }
};