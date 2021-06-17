const path = require('path')
// const express = require('express')
const BS = require('browser-sync')
const bs = BS.create()
const SRC_DIR = path.resolve(path.join(__dirname, '../src'))
const DEV_DIR = path.resolve(__dirname)

bs.init({
  server: [ SRC_DIR, DEV_DIR ],
  port: 8080,
  open: false,
  ui: false
})
bs.watch(DEV_DIR + '/index.html').on('change', bs.reload)
bs.watch(SRC_DIR + '/**/*.js').on('change', function (filepath, file) {
  bs.reload(filepath)
})