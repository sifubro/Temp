// import * as faceapi from 'face-api.js';

// LIBRARIES TO INSTALL
// npm install face-api.js
// npm install canvas
// npm install @tensorflow/tfjs
// npm install @tensorflow/tfjs-node --> error
// npm install node-pandas
// npm install csv
// npm install csv-parser
// npm install mongodb@6.0


 
const faceapi = require("face-api.js")

const tf = require('@tensorflow/tfjs');

const pandas = require('node-pandas');
const csv = require('csv-parser');

// require('@tensorflow/tfjs-node')

// import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

const path = require("path")

const fs = require("fs")

// const canvas = require("canvas")
const { loadImage } = require('canvas');
const { createCanvas } = require('canvas');
// npm install canvas

// const faceDetectionNet = require("faceDetectionNet")
// const faceDetectionOptions = require("faceDetectionOptions")
// const faceDetectionNet = faceapi.nets.ssdMobilenetv1
const faceDetectionNet = faceapi.nets.tinyFaceDetector

// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 320
const scoreThreshold = 0.5

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

// const saveFile = require("saveFile")
const baseDir = path.resolve(__dirname, '../out')
function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}

async function run() {



  // async function loadAndProcessDataFrame() {
  //   try {
  //     // Load the CSV file into a DataFrame
  //     const df = await pandas.read_csv('C://Users/SiFuBrO/Desktop/SCRIPTS!!!!!/face_detection/images.csv'); // Replace with your CSV file path
  
  //     // Loop through the rows of the DataFrame
  //     df.forEach((row) => {
  //       // Access and process each row's data
  //       console.log(row);
  //     });
  
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  
  // loadAndProcessDataFrame();


  const csv_data = [];

  fs.createReadStream('C://Users/SiFuBrO/Desktop/SCRIPTS!!!!!/face_detection/images.csv') // Replace with your CSV file path
    .pipe(csv())
    .on('data', (row) => {
      // Process each row's data
      console.log(row)
      csv_data.push(row);
    })
    .on('end', () => {
      // All rows have been processed
      console.log(csv_data);
    });


  await faceDetectionNet.loadFromDisk('./weights')

  var fpath = './images/surprised.jpg'

  const img = await loadImage(fpath)
  // const img = await canvas.loadImage('./images/bbt1.jpg')
  console.log(typeof(img))
  // const img = fs.readFileSync('./images/bbt1.jpg');

  // const img = await createImageBitmap(new Blob([data]));
  // const img = await faceapi.bufferToImage('./images/bbt1.jpg');


  // const canvass = createCanvas(img.width, img.height);
  // const ctx = canvass.getContext('2d');
  // ctx.drawImage(img, 0, 0, img.width, img.height);


  const canvass = createCanvas(img.width, img.height);
  const ctx = canvass.getContext('2d');
  
  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0, img.width, img.height);
  
  // Get the pixel data from the canvas and convert it to a tf.Tensor3D
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = new Uint8Array(imageData.data); // Uint8Array containing pixel data

  // Create a new Uint8Array without the alpha channel (R, G, B)
  const rgbData = new Uint8Array(data.length / 4 * 3); // Assumes data.length is a multiple of 4
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    rgbData[j] = data[i];       // Red channel
    rgbData[j + 1] = data[i + 1]; // Green channel
    rgbData[j + 2] = data[i + 2]; // Blue channel
  }

  const shape = [img.height, img.width, 3]; // 3 channels (RGB)

  // console.log(shape)
  // console.log(img.height * img.width * 4)
  // console.log("======")
  // console.log([img.height, img.width, 3])
  // console.log(img.height * img.width * 3)
  // console.log("======")
  const tensor = tf.tensor3d(rgbData, shape, 'int32');



  const detections = await faceapi.detectAllFaces(tensor, faceDetectionOptions)

  console.log(fpath)
  // console.log(detections[0]["FaceDetection"])

  // console.log(detections)
  result_JSON = JSON.parse(JSON.stringify(detections[0]))
  console.log(result_JSON)

  console.log("Finished!")

  // const out = faceapi.createCanvasFromMedia(img) // as any
  // faceapi.draw.drawDetections(out, detections)

  // saveFile('faceDetection.jpg', out.toBuffer('image/jpeg'))
  // console.log('done, saved results to out/faceDetection.jpg')
}

run()