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
    {imagePath: 'img1.jpg', coords: [0, 0], width: 640, height: 360,
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5',
        // rotationAngle: '-0.3',
        textStartCoords: [100, 200],
        fileName: 'test1.png'
      }
    },
    {imagePath: 'img3.jpg', coords: [50, 50], width: 100, height: 80,
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5',
        // rotationAngle: '-0.3',
        textStartCoords: [100, 200],
        fileName: 'test2.png'
      }
    },
    {imagePath: 'img2.jpg', coords: [0, 360], width: 320,  height: 240,
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5',
        // rotationAngle: '-0.3',
        textStartCoords: [100, 200],
        fileName: 'test3.png'
      }
    },
    {imagePath: 'img3.jpg', coords: [320, 360], width: 320, height: 240,
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5',
        // rotationAngle: '-0.3',
        textStartCoords: [100, 200],
        fileName: 'test4.png'
      }
    },
    {imagePath: 'test.png', coords: [270, 170], width: 320,  height: 240,
      textData: {
        text: 'bla bla bla',
        size: '32pt',
        color: '#DC143C',
        opacity: '0.5',
        shadowColor: '#0000FF',
        offsetX: '5',
        offsetY: '5',
        // rotationAngle: '-0.3',
        textStartCoords: [100, 200],
        fileName: 'test5.png'
      }
    }
  ]
}

router.get('/', function (req, res) {
  //  return res.json({status: 'ok'})

  if (params.length < 1) {
    return res.json({status: 'error', message: 'Params is empty'})
  }
  return lib.createPngImage(params.layers.textData, textData).then(function (result) {
    if (!result) {
      return res.json({status: 'error', massage: 'can not draw image'})
    }

    return lib.drawedImagesStream(params.layers, params.canvasOption).then(function (streams) {
      return Promise.map(streams, lib.writeImageToDisk)
    }).then(function (result) {
      return res.json({status: result ? 'ok' : 'error'})
    })
  })
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
