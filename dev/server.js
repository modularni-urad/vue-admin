const path = require('path')
// const express = require('express')
const HttpProxy = require('http-proxy-middleware')
const BS = require('browser-sync')
const bs = BS.create()
const SRC_DIR = path.resolve(path.join(__dirname, '../src'))
const DEV_DIR = path.resolve(__dirname)

// const token = null
// function onProxyReq(proxyReq, req, res) {
//   console.log(proxyReq)
// }
// function onProxyRes(proxyRes, req, res) {
//   // if (proxyRes.headers['set-cookie']) {
//   //   const m = proxyRes.headers['set-cookie'].match(/Bearer=([^;]*);*.$/)
//   //   token = m[0]
//   // }
//   console.log(proxyRes)
// }

bs.init({
  server: [ SRC_DIR, DEV_DIR ],
  port: 8080,
  open: false,
  ui: false,
  // middleware: [{
  //   route: '/api',
  //   handle: HttpProxy.createProxyMiddleware({ 
  //     target: 'https://stredni.web.otevrenamesta.cz/', 
  //     changeOrigin: true
  //     // onProxyReq, onProxyRes
  //   })
  // }]
})
bs.watch(DEV_DIR + '/index.html').on('change', bs.reload)
bs.watch(SRC_DIR + '/**/*.js').on('change', function (filepath, file) {
  bs.reload(filepath)
})