const ShellPlugin = require("webpack-shell-plugin-next");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const { FiveMResourceConfig } = require("./fivem-resource-config");

const resourceName = FiveMResourceConfig.resourceName;
if (!resourceName) {
    console.error("resourcePath not provided in config/fivem-resource-config.js");
    return;
}

/**
 * https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack#merging-plugins-configuration
 * because we use a custom angular webpack builder, the webpack config needs to return a function; this way
 * our custom rules do not overwrite angular-cli own rules and break the app
 *
/* we are using a custom webpack angular builder;  */
module.exports = (config, options, targetOptions) => {
    if (process.env.NUI_MODE == "dev-server") {
        /* the dev server does not need to produce an fxmanifest or copy assets */
        config.push(
            new DefinePlugin({
                RESOURCE_NAME: JSON.stringify(resourceName)
            })
        );
    } else {
        config.plugins.push(
            new DefinePlugin({
                RESOURCE_NAME: JSON.stringify(resourceName)
            }),
            new ShellPlugin({
                onBuildEnd: {
                    scripts: ["npm run nui:copy-assets"]
                },
                onAfterDone: {
                    scripts: ["npm run fivem:create"]
                }
            })
        );
    }

    return config;
}
