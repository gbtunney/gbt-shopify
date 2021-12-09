const path = require("path");

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                "@lib": path.resolve(__dirname, 'src/library'),
                '@c': path.resolve(__dirname, 'src/library/components'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.worker\.js$/,
                    use: { loader: "worker-loader" }
                }
            ]
        }
    }
}
