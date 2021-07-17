# Angular-NUI
FiveM-Angular Project

Creates a default resource for FiveM.
The resource is templated in `src/fivem-resource-scripts/fxmanifest.lua`.
It is configured via `config/fivem-resource.json`. By default all files that contain `server` or `client` in the `/src/fivem-resource-scripts` directory will be appended to the resource's `client_scripts` or `server_scripts` array accordingly.

All necessary files of the NUI, the fivem client/server scripts and an auto-created fxmanifest.lua will be copied to the specified output dir configured in `config/fivem-resource.json` each time a file has changed (almost; .lua file changes are not watched but can be triggered by any change to other watched files)

To start developing, just run `npm run all:watch`

`fivem-js` and `@citizenfx/client` are included, so you have full autocompletion for fiveM/citizenFX/gta-natives related stuff.
