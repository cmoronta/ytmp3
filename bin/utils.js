const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { PythonShell } = require("python-shell");
const readline = require("readline");
const { spawn } = require("child_process");

module.exports.convertToAiff = (filePath, args) =>
  new Promise((resolve, reject) => {
    convert(filePath).then(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("mp3 file removed.");
          resolve();
        }
      });
    });
  });

module.exports.splitFile = (file) => {
  new Promise((resolve, reject) => {
    console.log("Splitting file...\nThis might take a while...☕");
    const pythonProcess = spawn("python3", ["-m", "demucs", file]);
    pythonProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    pythonProcess.stderr.on("error", (err) => {
      reject(err);
    });

    pythonProcess.on("exit", (data) => {
      console.log("Split complete");
      resolve();
    });
  });
};

module.exports.downloadAudio = (stream, filePath) =>
  new Promise((resolve, reject) => {
    let start = Date.now();
    ffmpeg(stream)
      .audioBitrate(320)
      .save(filePath)
      .on("progress", (p) => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on("end", () => {
        console.log(`\nDone in - ${(Date.now() - start) / 1000}s`);
        resolve(filePath);
      })
      .on("err", (err) => {
        reject(err);
      });
  });

const convert = (filePath) =>
  new Promise((resolve, reject) => {
    const outputFile = filePath.replace(".mp3", ".aiff");
    ffmpeg({
      source: filePath,
    })
      .save(outputFile)
      .on("progress", () => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write("Converting to .aiff format...");
      })
      .on("end", () => {
        console.log(`Done. New file saved at ${outputFile}`);
        resolve(outputFile);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
