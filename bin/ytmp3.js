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
const { args } = require("./args");

const link = args._[0];
let filePath = "";
let title = "";

const { aiff, split, output } = args;
ytdl
	.getInfo(link) // Get video info and set title variable
	.then((info) => {
		title = info.videoDetails.title;
	})
	.then(() => {
		let stream = ytdl(link, {
			quality: "highestaudio",
		});

		filePath = `${output}/${title}.mp3`;

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
