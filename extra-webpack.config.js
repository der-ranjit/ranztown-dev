const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/fivem-scripts/fxmanifest.lua" },
                { from: "dist/fivem-scripts/server.js" },
                { from: "dist/fivem-scripts/client.js" },
            ]
        })
    ]
}
