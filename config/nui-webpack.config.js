const ShellPlugin = require("webpack-shell-plugin-next");

module.exports = {
    plugins: [
        new ShellPlugin({
            onBuildEnd: {
                scripts: [ "npm run nui:copy-assets" ]
            },
            onAfterDone: {
                scripts: [ "npm run fivem:create" ]
            }
        })
    ]
}
