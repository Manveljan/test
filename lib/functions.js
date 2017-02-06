var fs = require('fs')
var Canvas = require('canvas')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var Promise = require('bluebird')

/*
 * draw  and save images into a png stream
*/

function drawedImagesStream (layers, canvasOption) {
  var img = new Canvas.Image()
  var canvas = new Canvas(canvasOption.destWidth, canvasOption.destHeight)
  var ctx = canvas.getContext('2d')
  return Promise.map(layers, function (item) {
    img.src = __dirname + '/..' + config.uploadPath + item.imagePath
    ctx.drawImage(img, item.coords[0], item.coords[1], item.width, item.height)
    var stream = canvas.pngStream()
    return stream
  })
}

function createImageFromText (data, canvasOption) {
  var canvas = new Canvas(canvasOption.destWidth, canvasOption.destHeight)
  var ctx = canvas.getContext('2d')
  ctx.font = data.size + ' Impact'
  ctx.rotate(-0.15)
  ctx.shadowColor = data.shadowColor
  ctx.shadowOffsetX = data.offsetX
  ctx.shadowOffsetY = data.offsetY
  ctx.globalAlpha = data.opacity
  ctx.fillStyle = data.color
  ctx.fillText(data.text, data.coords[0], data.coords[1])
  var stream = canvas.pngStream()
  var tmpFileName = config.tmpImagePrefix + data.order + '.png'
  return writeTextToImage(stream, tmpFileName)
}

/*
*  draw rotated image
*/

// function drawRotatedImage (image, x, y, angle) {
//   context.translate(x, y)
//   context.rotate(angle)
//   context.drawImage(image, image.width, image.height)
// }

// function sortFactory (prop) {
//   return function (a, b) {
//     return parseInt(b[prop]) - parseInt(a[prop])
//   }
// }

/*
 *  write an joined images into a file
*/
// tmp_1.png
function writeTextToImage (stream, fileName) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + fileName)
  return new Promise(function (resolve, reject) {
    stream.on('data', function (add) {
      out.write(add)
    })
    stream.on('end', function () {
      console.log('end')
      return resolve(fileName)
    })
    stream.on('error', function (error) {
      console.log('error')
      return reject(error)
    })
  }).delay(1000)
}

function writeImageToDisk (stream, destName) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + destName)
  return new Promise(function (resolve, reject) {
    stream.on('data', function (add) {
      out.write(add)
    })
    stream.on('end', function () {
      return resolve(true)
    })
    stream.on('error', function (error) {
      return reject(error)
    })
  })
}

function convertTextLayerToImageLayer (layer, canvasOption) {
  return createImageFromText(layer, canvasOption).then(function (fileName) {
    if (!fileName) {
      return null
    }
    return {imagePath: fileName, coords: [0, 0], width: canvasOption.destWidth, height: canvasOption.destHeight, order: layer.order}
  })

  // return   {imagePath: 'img3.jpg', coords: [50, 50], width: canvasOption., height: 80, order: layer.order}
}

function getLayers (params) {
  return Promise.map(params.layers, function (layer) {
    if (layer.textData) {
      return convertTextLayerToImageLayer(layer, params.canvasOption)
    }
    return layer
  })
}

module.exports = {
  drawedImagesStream: drawedImagesStream,
  writeImageToDisk: writeImageToDisk,
  writeTextToImage: writeTextToImage,
  getLayers: getLayers
}
