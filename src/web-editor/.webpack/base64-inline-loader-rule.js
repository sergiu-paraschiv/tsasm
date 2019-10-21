module.exports = {
    test: /\.(jpe?g|png)$/,
    use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
};