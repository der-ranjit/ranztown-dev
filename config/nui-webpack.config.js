const ShellPlugin = require("webpack-shell-plugin-next");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const { FiveMResourceConfig } = require("./fivem-resource-config");

const resourceName = FiveMResourceConfig.resourceName;
if (!resourceName) {
    console.error("resourcePath not provided in config/fivem-resource-config.js");
    return;
}


/* the dev server does not need to produce an fxmanifest or copy assets */
const devServerPlugins = [
    new DefinePlugin({
        RESOURCE_NAME: JSON.stringify(resourceName)
    })
];

const plugins = [
    new DefinePlugin({
        RESOURCE_NAME: JSON.stringify(resourceName)
    }),
    new ShellPlugin({
        onBuildEnd: {
            scripts: [ "npm run nui:copy-assets" ]
        },
        onAfterDone: {
            scripts: [ "npm run fivem:create" ]
        }
    })
]
module.exports = {
    plugins: process.env.NUI_MODE == "dev-server" ? devServerPlugins : plugins
}
