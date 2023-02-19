# YouTube to MP3 Converter

ytmp3 is a YouTube mp3 downloader using either a YT link or video ID with the ability to convert to .aiff files to import into Logic Pro or GarageBand. Implementation is using ytdl-core.

## Installation

Download the code and run:

```bash
npm install -g
yarn global add file:$PWD
```

## Usage

To download a YouTube Link to your Downloads folder:

```bash
ytmp3 "<YouTube Link>"
```

To download with a video ID:

```bash
ytmp3.js "<YouTube ID>"
```

To download and convert a link:

```bash
ytmp3 "<YouTube ID | YouTube Link>" -a --aiff
```

To download and split into stems using demucs

```bash
ytmp3 "<YouTube ID | YouTube Link>" -s --split
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
