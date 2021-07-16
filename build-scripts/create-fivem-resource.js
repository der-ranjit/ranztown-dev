const path = require("path");
const fs = require("fs");
const Glob = require("glob");
const Handlebars = require('handlebars');

const resourceConfig = require("../config/fivem-resource.json");
const resourcePath = resourceConfig.resourcePath;
if (!resourcePath) {
    console.error("NO RESOURCE PATH SPECIFIED");
    return;
}

const DIST_PATH = path.resolve(__dirname + "/../dist/");
const MANIFEST_TEMPLATE_PATH = path.resolve(__dirname + "/../src/fivem-resource-scripts/fxmanifest.lua");
const MANIFEST_TARGET_PATH = path.resolve(__dirname + "/../dist/fxmanifest.lua");
const TARGET_PATH = path.resolve(resourcePath);

const author = resourceConfig.author ?? "Author";
const version = resourceConfig.version ?? "0.0.0";
const description = resourceConfig.description ?? "Angular-NUI";

/* relative paths for fxmanifest.lua */
const resourceFilesNames = Glob.sync(DIST_PATH + "**/*")
    .map(file => path.basename(file))
    // filter out possibly existing fxmanifest.lua; it should not appear in the files list
    .filter(file => file.indexOf("fxmanifest") === -1);
const clientFiles = resourceFilesNames.filter(file => file.indexOf("client") !== -1);
const serverFiles = resourceFilesNames.filter(file => file.indexOf("server") !== -1);

// create fxmanifest.lua
const templateSource = fs.readFileSync(MANIFEST_TEMPLATE_PATH).toString();
const template = Handlebars.compile(templateSource);
const contents = template({
    AUTHOR: `"${author}"`,
    VERSION: `"${version}"`,
    DESCRIPTION: `"${description}"`,
    RESOURCE_FILES: `${formatArrayForManifest(resourceFilesNames)}`,
    CLIENT_SCRIPTS: `${formatArrayForManifest(clientFiles)}`,
    SERVER_SCRIPTS: `${formatArrayForManifest(serverFiles)}`
});
fs.writeFileSync(MANIFEST_TARGET_PATH, contents);

// copy all files in dist to resourcePath specified in config
const files = Glob.sync(DIST_PATH + "**/*").map(file => path.resolve(file));
for (let file of files) {
    fs.copyFileSync(file, `${TARGET_PATH}/${path.basename(file)}`)
}

console.log("---- CREATING AND COPYING RESOURCE DONE ----");

function formatArrayForManifest(stringArray) {
    result = "";
    for (let i = 0; i < stringArray.length; i++) {
        result += `  "${stringArray[i]}"` + (i < stringArray.length - 1 ? ",\n" : "");
    }
    return result;
}
