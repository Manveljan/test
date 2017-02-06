var fs = require('fs')
var Canvas = require('canvas')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var Promise = require('bluebird')

/*
 * draw  and save images into a png stream
*/

function drawedImagesStream (layers, canvasOption) {
  var img = new Canvas.Image
  var canvas = new Canvas(canvasOption.destWidth, canvasOption.destHeight)
  var ctx = canvas.getContext('2d')

  return Promise.map(layers, function (item) {
    img.src = __dirname + '/..' + config.uploadPath + item.imagePath
    ctx.drawImage(img, item.coords[0], item.coords[1], item.width , item.height)
    var stream = canvas.pngStream()
    return {stream, fileName: canvasOption.destName}
  })
}

function createPngImage (layers, textData) {
  var canvas = new Canvas(640, 600)
  var ctx = canvas.getContext('2d')
  ctx.font = layers.textData.size + ' Impact'
  ctx.rotate(-0.15)
  ctx.shadowColor = layers.textData.shadowColor
  ctx.shadowOffsetX = textData.offsetX
  ctx.shadowOffsetY = textData.offsetY
  ctx.globalAlpha = textData.opacity
  ctx.fillStyle = textData.color
  ctx.fillText(textData.text, textData.textStartCoords[0], textData.textStartCoords[1])
  var stream = canvas.pngStream()

  return writeTextToImage(stream, textData.fileName)
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

function writeTextToImage (stream, fileName) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + fileName)
  return new Promise(function (resolve, reject) {
    stream.on('data', function (add) {
      out.write(add)
    })
    stream.on('end', function () {
      console.log('end')
      return resolve(true)
    })
    stream.on('error', function (error) {
      console.log('error')
      return reject(error)
    })
  }).delay(1000)
}

function writeImageToDisk (data) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + data.fileName)
  return new Promise(function (resolve, reject) {
    data.stream.on('data', function (add) {
      out.write(add)
    })
    data.stream.on('end', function () {
      return resolve(true)
    })
    data.stream.on('error', function (error) {
      return reject(error)
    })
  })
}

module.exports = {
  drawedImagesStream: drawedImagesStream,
  writeImageToDisk: writeImageToDisk,
  writeTextToImage: writeTextToImage,
  createPngImage: createPngImage
}
