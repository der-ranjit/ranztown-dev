# Angular-NUI
FiveM-Angular Project

Creates a default resource for FiveM.
The resource is templated in `src/fivem-scripts/fxmanifest.lua`.
It is configured via `config/fivem-resource-config.js`. By default all files that contain `server` or `client` in the `/src/fivem-scripts` directory will be appended to the resource's `client_scripts` or `server_scripts` array accordingly.

All necessary files of the NUI, the fivem client/server scripts and an auto-created fxmanifest.lua will be copied to the specified output dir configured in `config/fivem-resource-config.js` each time a file has changed (almost; .lua file changes are not watched but can be triggered by any change to other watched files)

To start developing, just run `npm run all:watch`.
This will watch all files under src, and when changed create a fivem resource as defined in `config/fivem-resource-config.js`, and copy it to the correct folder. It will also restart the resource on the server, so you don't have to do anything special but writing code and switch in-game to see the results.

You can also run `npm run start` to start a dev-server for the nui-app. This way you can test out ui changes faster. Keep in mind that there is no client code / game interaction available, of course. 

Run `npm run all:build` to create a minified bundle for the resource.

`fivem-js` and `@citizenfx/client` are included, so you have full autocompletion for fiveM/citizenFX/gta-natives related stuff.
