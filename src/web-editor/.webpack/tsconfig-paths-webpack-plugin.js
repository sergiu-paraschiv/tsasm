const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


module.exports = new TsconfigPathsPlugin({
    configFile: './tsconfig.json'
});