const path = require('path')
const express = require('express')
const BS = require('browser-sync')
const bs = BS.create()
const WEB_FOLDER = path.resolve(path.join(__dirname, '../src'))
// const NODE_MODULES = path.resolve(path.join(__dirname, '../node_modules'))

bs.init({
  server: WEB_FOLDER,
  port: 8080,
  // host,
  open: false,
  ui: false,
  // middleware: [
  //   express.static(NODE_MODULES),
  // bodyParser.json(),
  // {
  //   route: '/api',
  //   handle: data
  // },
  // {
  //   route: '/webdav',
  //   handle: WebDAVHandler(path.join(WEB_FOLDER, 'style'))
  // }
  // ]
})
bs.watch(WEB_FOLDER + '/index.html').on('change', bs.reload)