-- Enter Resource details here
version '1.0.0'
author 'ranjit'
description 'test'
fx_version 'adamant'
games { 'gta5' }

-- Do not modify the folling lines; they are used to auto-create a fxmanifest based on this project's files
ui_page 'index.html'

client_scripts {
  'client.js'
}

server_scripts {
  'server.js'
}

files {
  'index.html',
  'styles.css',
  'main.js',
  'polyfills.js',
  'runtime.js',
  'clients.js',
  'server.js'
}
