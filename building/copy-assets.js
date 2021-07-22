/* copy the assets from dist folder to target path */
const fse = require("fs-extra");
const path = require("path");
const { FiveMResourceConfig } = require("../config/fivem-resource-config");


const resourcePath = FiveMResourceConfig.resourcePath;
if (!resourcePath) {
    console.error("NO TARGET RESOURCE PATH SPECIFIED. PLEASE CHECK 'config/fivem-resource-config.j'");
    return;
}

const ASSET_PATH = path.resolve(__dirname + "/../dist/nui-app/assets");
const TARGET_PATH = path.resolve(`${resourcePath}/${FiveMResourceConfig.resourceName}/nui-app/assets`);
fse.copySync(ASSET_PATH, TARGET_PATH)

console.log("-----------------")
console.log("--ASSETS COPIED--")
console.log("-----------------")
