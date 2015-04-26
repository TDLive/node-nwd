# node-nwd
a node.js library for parsing and manipulating (unencrypted) nimble writer documents (.nwd)

## Install

```
git clone https://github.com/TDLive/node-nwd.git
cd node-nwd
npm install
```

## Use

```
var nwd = require("nwd");

nwd("/path/to/my/file.nwd", function(res){
  console.log("That's " + res.metadata.title + " by " + res.metadata.author);
});
```

## API

### `nwd(String file, Function callback)`

Opens a file for parsing. Calls `callback` with an Object that contains information
about the NWD opened.

### `response`
#### String `response.file`
The name of the file
#### Object `response.metadata`
Contains metadata about the work itself. `response.metadata.title` is the title and
`response.metadata.author` is the author.
#### Array `response.chapters`
Contains the chapters of the work. Each chapter is an Object with the fields `id`,
`chapterCode` (how it's represented in the NWD), `title` (the title of the chapter),
and `text` (the text of the chapter).
#### Number `response.numChapters`
The number of chapters in the work. 0 if there's no chapters.
#### Number `response.lastChapterID`
The ID of the last chapter in the book. -1 if there's no chapters.
#### JSZip `response.zip`
The raw zip file as interpreted by JSZip
#### Function `response.setChapterName(String chapterCode, String name, Function callback)`
This changes the title of the chapter identified as `chapterCode`.
#### Function `response.setChapterText(String chapterCode, String text, Function callback)`
This changes the text of the chapter identified as `chapterCode`.
#### Function `String response.createNiceChapterCode()`
Creates a nice `chapterCode` from an ID.

## License
See LICENSE
