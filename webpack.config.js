const webpack = require('webpack');
const path = require('path');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const outPath = path.resolve(__dirname, './dist');
const sourcePath = path.resolve(__dirname, './src');

const mainConfig = (env, argv) => {

    const devtool = argv.mode === 'production' ? 'none' : 'source-map';

    return {
        mode: argv.mode,
        context: sourcePath,
        
        devtool,
        devServer: {
            historyApiFallback: true,
            hot: false,
            port: 3000,
        },
        entry: {
            'main': './index.js',
            'style': './style.css'
        },
        module: {
            rules: [{
                exclude: /node_modules/,
                test: /\.js(|x)?$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['@babel/preset-env', {
                                corejs: '3.x',
                                targets: {
                                    browsers: '> 10%, not dead'
                                },
                                useBuiltIns: 'usage',
                            }],
                        ],
                    },
                }],
            }, {
                test: /\.(png|jp(e*)g|gif|eot|svg|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 1000,
                        name: 'assets/[name]-[hash].[ext]',
                    },
                }],
            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            }]
        },
        output: {
            chunkFilename: '[name].[hash].bundle.js',
            path: outPath,
            publicPath: '/',
            pathinfo: false
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            new MiniCssExtractPlugin({
                chunkFilename: '[id]-[hash].css',
                filename: '[name]-[hash].css',
            })
        ],
        resolve: {
            extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
        },
        target: 'web',
    };

};

module.exports = mainConfig;
