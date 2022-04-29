# YouTube to MP3 Converter

ytmp3 is a YouTube mp3 downloader using either a YT link or video ID with the ability to convert to .aiff files to import into Logic Pro or GarageBand. Implementation is using ytdl-core.

## Installation

Download the code and run:

```bash
npm install -g
```


## Usage

To download a YouTube Link to your Downloads folder:
```bash
ytmp3 "URL" 
```
To download with a video ID:
```bash
ytmp3.js ID
```

To download and convert a link:
```bash
ytmp3 "[Youtube Link]" or ID -a
```

```bash
ytmp3 "[Youtube Link]" of ID --aiff
```
## License
[MIT](https://choosealicense.com/licenses/mit/)