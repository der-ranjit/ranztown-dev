# ranztown-dev
FiveM-Angular Project

Creates a default resource for FiveM.
The resource is described in `src/fivem-scripts/fxmanifest.lua` and by default includes all webpack generated files and a `client.ts` and `server.ts`. 
Those files are not bundled via webpack but instead are tranpsiled to js only.

All files (including resource manifest) will be copied to the specified output dir in `angular.json`, line 27 `outputPath`. 
This should point to your local fivem-servers appropriate resource folder.

To start developing, just run `npm run watch-scripts` (for fivem client/server scripts) and `npm run watch` (for the Angular NUI application).

`fivem-js` and `@citizenfx/client` are included, so you have full autocompletion for fiveM/citizenFX/gta-natives related stuff.
