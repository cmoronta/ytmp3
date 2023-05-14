const yargs = require("yargs");
const ytdl = require("ytdl-core");
const usage = 'Usage: $0 "<link>" [options]';
const os = require("os");

module.exports.args = yargs
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
	.option("output", {
		alias: "o",
		describe: "Output destination for splitting/downloading",
		default: `${os.homedir()}/Downloads`,
	})
	.help("h")
	.alias("h", "help").argv;
