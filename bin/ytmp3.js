#!/usr/bin/env node

// Expected behavior:
// Called by: ./ytmp3.js "[Youtube Link]" --option option1Arg
// in this case the only available option will be --aiff or -a

const readline = require("readline");
const ytdl = require("ytdl-core");
const { PythonShell } = require("python-shell");
const { convertToAiff, downloadAudio, splitFile } = require("./utils");
const yargs = require("yargs");
const homeDir = require("os").homedir();
const usage = 'Usage: $0 "<link>" [options]';

const argv = yargs
  .scriptName("ytmp3")
  .version("1.1")
  .usage(usage)
  .positional("_", {
    describe: "YouTube link",
    type: "string",
    coerce: (link) => {
      if (link.length === 0) throw new Error("Link is required");
      let linkItem = link[0];
      if (ytdl.validateID(linkItem) || ytdl.validateURL(linkItem)) {
        return link;
      } else {
        throw new Error(`Error: Invalid YouTube link`);
      }
    },
  })
  .option("aiff", {
    alias: "a",
    describe: "Convert file to .aiff format",
  })
  .option("split", {
    alias: "s",
    describe:
      "Split song into its components stems using demucs (drums, bass, vocals, other) and download to current directory",
  })
  .help("h")
  .alias("h", "help").argv;

const link = argv._[0];
let filePath = "";
let title = "";

const { aiff, split } = argv;
ytdl
  .getInfo(link) // Get video info and set title variable
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
        // Options
        if (aiff && split) {
          convertToAiff(filePath).then((file) => {
            splitFile(file);
          });
        } else if (aiff) {
          convertToAiff(filePath);
        } else if (split) {
          splitFile(filePath);
        }
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  });
