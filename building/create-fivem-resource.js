const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const glob = require("glob");
const handlebars = require("handlebars");
const { execFile } = require("child_process")
const { FiveMResourceConfig } = require("../config/fivem-resource-config");

const resourcePath = FiveMResourceConfig.resourcePath;
if (!resourcePath) {
    console.error("NO TARGET RESOURCE PATH SPECIFIED. PLEASE CHECK 'config/fivem-resource-config.js'");
    return;
}

const DIST_PATH = path.resolve(__dirname + "/../dist");
const RESOURCE_SCRIPTS_PATH = path.resolve(__dirname + "/../src/fivem-scripts");
const TARGET_PATH = path.resolve(`${resourcePath}/${FiveMResourceConfig.resourceName}`);


createFXManifest();
copyFilesToResourceTarget();
reloadServerResource();
console.info("---------------------------------------------------------------");
console.info("---- FIVEM RESOURCE CREATED, COPIED AND RESTARTED -------------");
console.info("---------------------------------------------------------------");

function createFXManifest() {
    const MANIFEST_FILE_NAME = "fxmanifest.lua";
    const MANIFEST_TEMPLATE_PATH = path.resolve(`${__dirname}/../building/${MANIFEST_FILE_NAME}`);
    const MANIFEST_TARGET_PATH = path.resolve(`${__dirname}/../dist/${MANIFEST_FILE_NAME}`);

    const author = FiveMResourceConfig.author ?? "Author";
    const version = FiveMResourceConfig.version ?? "0.0.0";
    const description = FiveMResourceConfig.description ?? "Angular-NUI";

        // *.ts/*.js files are automatically moved to dist path by tsc, but *.lua files have to be copied manually
    fse.ensureDir(`${DIST_PATH}/lua`);
    glob.sync(`${RESOURCE_SCRIPTS_PATH}/_lua/*.lua`)
        .forEach(file => fs.copyFileSync(file, `${DIST_PATH}/lua/${path.basename(file)}`))
    // *.ts/*.js files are automatically moved to dist path by tsc, but *.lua files have to be handled manually
    let resourceFilesNames = glob.sync(`${DIST_PATH}/**/*.*`)
        // filter out possibly existing fxmanifest.lua; it should not appear in the files list
        // filter out assets
        .filter(file => file.indexOf(MANIFEST_FILE_NAME) === -1 && file.indexOf("assets") === -1)
        // fix backward slashes
        .map(file => path.relative(DIST_PATH, file).replace(/\\/g, '/'));

    // add assets glob
    resourceFilesNames.push("nui-app/assets/**/*");
    // clean from possible duplicate entries resulting from an already populated dist folder
    resourceFilesNames = [...new Set(resourceFilesNames)];

    const clientScripts = resourceFilesNames.filter(file => file.indexOf("client") !== -1);
    const serverScripts = resourceFilesNames.filter(file => file.indexOf("server") !== -1);
    // scriptFiles do not need to be referenced in files array
    resourceFilesNames = resourceFilesNames.filter(file => !clientScripts.includes(file) && !serverScripts.includes(file));
    const indexHtml = resourceFilesNames.find(file => file.indexOf("index.html") !== -1);

    const templateSource = fs.readFileSync(MANIFEST_TEMPLATE_PATH).toString();
    const template = handlebars.compile(templateSource);
    const contents = template({
        AUTHOR: `"${author}"`,
        VERSION: `"${version}"`,
        DESCRIPTION: `"${description}"`,
        INDEX_HTML: `"${indexHtml}"`,
        RESOURCE_FILES: `${formatArrayForManifest(resourceFilesNames)}`,
        CLIENT_SCRIPTS: `${formatArrayForManifest(clientScripts)}`,
        SERVER_SCRIPTS: `${formatArrayForManifest(serverScripts)}`
    });
    fs.writeFileSync(MANIFEST_TARGET_PATH, contents);
}

function copyFilesToResourceTarget() {

    // exclude assets
    const distFiles = glob.sync(`${DIST_PATH}/**/*.*`).filter(file => file.indexOf("assets") === -1)
    // make sure subfolder for nui-app exists so fse shuts up; this needs to be refactored so hard
    fse.ensureDir(`${TARGET_PATH}`);
    fse.ensureDir(`${TARGET_PATH}/lua`);
    fse.ensureDir(`${TARGET_PATH}/nui-app`);
    distFiles.forEach(file => {
        fse.copyFileSync(file, getAssetCopyPath(file, TARGET_PATH), )
    })

    function getAssetCopyPath(filePath, targetPath) {
        const relativeToDistPath = path.relative(DIST_PATH, filePath);
        // fix backslashes with regexp
        const relativeTargetPath = `${targetPath}/${relativeToDistPath}`.replace(/\\/g, '/');
        return relativeTargetPath;
    }
}

function formatArrayForManifest(stringArray) {
    result = "";
    for (let i = 0; i < stringArray.length; i++) {
        result += `  "${stringArray[i]}"` + (i < stringArray.length - 1 ? ",\n" : "");
    }
    return result;
}

function reloadServerResource() {
    const pw = FiveMResourceConfig.rconPassword;
    const ip = FiveMResourceConfig.ip;
    const port = FiveMResourceConfig.port;
    const resourceName = FiveMResourceConfig.resourceName
    execFile("building/icecon",[`-c ensure ${resourceName}`, `${ip}:${port}`,`${pw}`]);
}
