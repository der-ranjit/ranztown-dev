const ShellPlugin = require("webpack-shell-plugin-next");

module.exports = {
    plugins: [
        new ShellPlugin({
            onBuildEnd: {
                scripts: [ "npm run fivem:create" ]
            }
        })
    ]
}
