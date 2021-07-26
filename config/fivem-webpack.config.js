const ShellPlugin = require("webpack-shell-plugin-next");
const webpack = require('webpack');

module.exports = {
    entry: {
        client: './src/fivem-scripts/main.client.ts',
        server: './src/fivem-scripts/main.server.ts',
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'config/tsconfig.fivem.json'
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/../dist/',
    },
    plugins: [
        // for screenshot-basic
        // https://github.com/felixge/node-formidable/issues/337#issuecomment-153408479
        new webpack.DefinePlugin({ "global.GENTLY": false }),
        new ShellPlugin({
            onAfterDone: {
                scripts: [ "npm run fivem:create" ]
            }
        })
    ],
    target: "node"
};
