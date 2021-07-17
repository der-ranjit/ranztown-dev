const path = require("path");
const fs = require("fs");
const fse = require('fs-extra');
const Glob = require("glob");
const Handlebars = require('handlebars');

const resourceConfig = require("../config/fivem-resource.json");
const resourcePath = resourceConfig.resourcePath;
if (!resourcePath) {
    console.error("NO RESOURCE PATH SPECIFIED");
    return;
}

const DIST_PATH = path.resolve(__dirname + "/../dist");
const RESOURCE_SCRIPTS_PATH = path.resolve(__dirname + "/../src/fivem-resource-scripts");
const TARGET_PATH = path.resolve(resourcePath);

createFXManifest();
copyFilesToResourceTarget();

function createFXManifest() {
    const MANIFEST_FILE_NAME = "fxmanifest.lua";
    const MANIFEST_TEMPLATE_PATH = path.resolve(`${__dirname}/../config/${MANIFEST_FILE_NAME}`);
    const MANIFEST_TARGET_PATH = path.resolve(`${__dirname}/../dist/${MANIFEST_FILE_NAME}`);

    const author = resourceConfig.author ?? "Author";
    const version = resourceConfig.version ?? "0.0.0";
    const description = resourceConfig.description ?? "Angular-NUI";

    // *.ts/*.js files are automatically moved to dist path by tsc, but *.lua files have to be handled manually
    let resourceFilesNames = Glob.sync(`${DIST_PATH}/**/*`).concat(Glob.sync(`${RESOURCE_SCRIPTS_PATH}/*.lua`))
        // filter out possibly existing fxmanifest.lua; it should not appear in the files list
        .filter(file => file.indexOf(MANIFEST_FILE_NAME) === -1)
        .map(file => path.basename(file));
    // clean from possible duplicate entries resulting from an already populated dist folder
    resourceFilesNames = [...new Set(resourceFilesNames)];
    const clientScripts = resourceFilesNames.filter(file => file.indexOf("client") !== -1);
    // filter out *.js files for serverScripts since fivem does not allow .js as server scripts
    const serverScripts = resourceFilesNames.filter(file => file.indexOf("server") !== -1 && file.indexOf(".js") === -1);
    // scriptFiles do not need to be referenced in files array
    resourceFilesNames = resourceFilesNames.filter(file => !clientScripts.includes(file) && !serverScripts.includes(file));

    const templateSource = fs.readFileSync(MANIFEST_TEMPLATE_PATH).toString();
    const template = Handlebars.compile(templateSource);
    const contents = template({
        AUTHOR: `"${author}"`,
        VERSION: `"${version}"`,
        DESCRIPTION: `"${description}"`,
        RESOURCE_FILES: `${formatArrayForManifest(resourceFilesNames)}`,
        CLIENT_SCRIPTS: `${formatArrayForManifest(clientScripts)}`,
        SERVER_SCRIPTS: `${formatArrayForManifest(serverScripts)}`
    });
    fs.writeFileSync(MANIFEST_TARGET_PATH, contents);
}

function copyFilesToResourceTarget() {
    // *.ts/*.js files are automatically moved to dist path by tsc, but *.lua files have to be copied manually
    const luaResourceFiles = Glob.sync(`${RESOURCE_SCRIPTS_PATH}/*.lua`)
        .forEach(file => fs.copyFileSync(file, `${DIST_PATH}/${path.basename(file)}`))
    fse.copySync(DIST_PATH, TARGET_PATH)
    console.log("---- CREATING AND COPYING RESOURCE DONE ----");
}

function formatArrayForManifest(stringArray) {
    result = "";
    for (let i = 0; i < stringArray.length; i++) {
        result += `  "${stringArray[i]}"` + (i < stringArray.length - 1 ? ",\n" : "");
    }
    return result;
}
