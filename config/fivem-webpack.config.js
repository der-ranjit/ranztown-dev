const ShellPlugin = require("webpack-shell-plugin-next");

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
        new ShellPlugin({
            onAfterDone: {
                scripts: [ "npm run fivem:create" ]
            }
        })
    ],
    target: "node"
};
