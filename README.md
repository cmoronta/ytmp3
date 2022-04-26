# YouTube to MP3 Converter

ytmp3 is a YouTube mp3 downloader using either a YT link or video ID with the ability to convert to .aiff files to import into Logic Pro or GarageBand.

## Installation

WIP to make it a global cli script but you can download the code and run the following to download the necessary packages to make it work.

```bash
npm
```
or
```bash
yarn
```

## Usage
(Can only run in the folder that you downloaded the code in)

To download a YouTube Link to your Downloads folder:
```bash
./ytmp3.js "URL" 
```

```bash
./ytmp3.js ID
```

To download and convert a link:
```bash
./ytmp3.js "[Youtube Link]" -a
```

```bash
./ytmp3.js "[Youtube Link]" --aiff
```
## License
[MIT](https://choosealicense.com/licenses/mit/)