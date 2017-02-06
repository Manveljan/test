var express = require('express')
var router = express.Router()
var url = require('url')
var request = require('request')
var Promise = require('bluebird')
var lib = require('../lib/functions.js')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]

var params = {
  canvasOption: {
    destName: 'out.png',
    destWidth: 640,
    destHeight: 600
  },
  layers: [
    {imagePath: 'img1.jpg', coords: [0, 0], width: 640, height: 360, order: 1},
    {textData: {
      text: 'bla bla bla',
      size: '32pt',
      color: '#DC143C',
      opacity: '0.5',
      shadowColor: '#0000FF',
      offsetX: '5',
      offsetY: '5'
    },
      coords: [15, 300],
      order: 2
    },
    {textData: {
      text: 'bla bla bla',
      size: '32pt',
      color: '#DC143C',
      opacity: '0.5',
      shadowColor: '#0000FF',
      offsetX: '5',
      offsetY: '5'
    },
      coords: [100, 300],
      order: 2
    },
    {imagePath: 'img3.jpg', coords: [50, 50], width: 100, height: 80, order: 3},
    {imagePath: 'img2.jpg', coords: [0, 360], width: 320, height: 240, order: 4},
    {
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5'
      },
      coords: [150, 300],
      order: 5
    }
  ]
}

router.get('/', function (req, res) {
  if (params.length < 1 && params.layers.length < 1) {
    return res.json({status: 'error', message: 'Params is empty'})
  }

  return lib.getLayers(params).then(function (layers) {
    return lib.drawedImagesStream(layers, params.canvasOption).then(function (streams) {
      return Promise.map(streams, function (item) {
        lib.writeImageToDisk(item, params.canvasOption.destName)
      })
    }).then(function (result) {
      return res.json({status: result ? 'ok' : 'error'})
    })
  })

  // return lib.createImagesFromText(params).then(function (result) {
  //   if (!result) {
  //     return res.json({status: 'error', massage: 'can not draw image'})
  //   }
  //   return res.json({status: 'error', massage: 'can not draw image'})
  //   return lib.drawedImagesStream(params.layers, params.canvasOption).then(function (streams) {
  //     return Promise.map(streams, function (item) {
  //       lib.writeImageToDisk(item, params.canvasOption.destName)
  //     })
  //   }).then(function (result) {
  //     return res.json({status: result ? 'ok' : 'error'})
  //   })
  // })
})
// request.post({url: 'http://service.com/upload', form: {key: 'value'}},
//   function (err, httpResponse, body) { /* ... */ })

// request.post('http://example.com/api', function (err, response, body) { ... })
// rp.post('http://example.com/api').then(...)

// return new Promise(function (resolve, reject) {
//   return lib.createPngImage(params.textData).then(function (result) {
//     return resolve(result)
//   })
// }).on('error', function (e) {
//   return reject('Got error: ' + e.message)
// })
// })

module.exports = router
