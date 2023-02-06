#!/usr/bin/env node

// Expected behavior:
// Called by: ./ytmp3.js "[Youtube Link]" --option option1Arg
// in this case the only available option will be --aiff or -a

const readline = require("readline");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");
const fs = require("fs");

const homeDir = os.homedir();

// process.argv returns [env, filepath, ...] so need to slice first two off
const args = process.argv.slice(2);

// Usage prompt
if (args.length < 1) {
  console.log('Usage: ./ytmp3.js "[Youtube Link]" --option option1Arg');
  process.exitCode = 1;
} else {
  let link = args[0];
  let title = "";

  let filePath = "";
  // If valid URL or ID (watch?="ID") process request
  if (ytdl.validateID(args[0]) || ytdl.validateURL(args[0])) {
    ytdl
      .getInfo(args[0]) // Get video info and set title variable
      .then((info) => {
        title = info.videoDetails.title;
      })
      .then(() => {
        let stream = ytdl(link, {
          quality: "highestaudio",
        });

        filePath = `${homeDir}/Downloads/${title}.mp3`;

        console.log(`Saving to file path: ${filePath}`);

        // Downloading mp3 stream here
        downloadAudio(stream, filePath)
          .then((filePath) => {
            // If user wants to convert to aiff remove the mp3 file as well
            if (args[1] === "--aiff" || args[1] === "-a") {
              convertToAif(filePath).then(() => {
                fs.unlink(filePath, (err) => {
                  if (err) {
                    throw err;
                  } else {
                    console.log("mp3 file removed.");
                  }
                });
              });
            }
          })
          .catch((err) => {
            console.log("err: " + err.code, err.message);
          });
      });
  } else {
    console.log("Invalid or empty YouTube URL"); // If neither a valid URL/ID then err
    process.exitCode = 1;
  }
}

const downloadAudio = (stream, filePath) =>
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
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
        resolve(filePath);
      })
      .on("err", (err) => {
        reject(err);
      });
  });

const convertToAif = (filePath) =>
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
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
