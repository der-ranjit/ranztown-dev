/* copy the assets from dist folder to target path */
const fse = require("fs-extra");
const path = require("path");

const resourceConfig = require("../config/fivem-resource.json");
const resourcePath = resourceConfig.resourcePath;
if (!resourcePath) {
    console.error("NO TARGET RESOURCE PATH SPECIFIED. PLEASE CHECK 'config/fivem-resource.json'");
    return;
}

const ASSET_PATH = path.resolve(__dirname + "/../dist/nui-app/assets");
const TARGET_PATH = path.resolve(`${resourcePath}/nui-app/assets`);
fse.copySync(ASSET_PATH, TARGET_PATH)

console.log("-----------------")
console.log("--ASSETS COPIED--")
console.log("-----------------")
