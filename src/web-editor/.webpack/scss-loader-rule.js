const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    test: /\.scss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: true,
                reloadAll: true,
            }
        },

        {
            loader: 'css-modules-typescript-loader'
        },

        {
            loader: 'css-loader',
            options: {
                modules: {
                    getLocalIdent: (_1, _2, localName) => {
                        return localName;
                    },
                }
            }
        },

        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                sassOptions: {
                    includePaths: ['../node_modules', '../src'],
                }
            }
        }
    ]
};