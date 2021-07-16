const ShellPlugin = require("webpack-shell-plugin-next");

module.exports = {
    plugins: [
        new ShellPlugin({
            onAfterDone: {
                scripts: [ "npm run fivem:create" ]
            }
        })
    ]
}
