// a node.js library for parsing and manipulating Nimble Writer documents
// copyright (c) 2015 sweeti alexandra, http://sw.eeti.me/

var fs = require("fs");
var zip = require("node-zip");

module.exports = function(file, callback){

	var r = {};

	r.file = file;

	if( ! fs.existsSync(r.file) ) throw "File does not exist";
	
	fs.readFile(r.file, function(e,d){
		if( e ) throw "Error reading file: " + e;
		
		try {
			r.zip = new zip(d, {base64: false, checkCRC32: true});
		}
		catch(e) {
			throw "Error unzipping file, is it encrypted? " + e;
		}
		
		try {
			var metadata = JSON.parse(r.zip.files["metadata.json"].asText());
			if( ! metadata.title || ! metadata.author ) throw "Metadata invalid";
		}
		catch(e){
			throw "Error parsing metadata, is it encrypted? " + e;
		}
		
		r.metadata = {};
		r.metadata.title = metadata.title;
		r.metadata.author = metadata.author;
		
		r.createNiceChapterCode = function(id){
			
			if( id < 10 ) chapterCode="000"+chapterCode;
			else if( id < 100 ) chapterCode="00"+chapterCode;
			else if( id < 1000 ) chapterCode="0"+chapterCode;
			else chapterCode=""+chapterCode;
		}
		
		var currChapter = -1;
		r.chapters = [];
		
		while( true ){
			var chapterCode = currChapter+1;
			
			r.createNiceChapterCode(chapterCode);
			
			if( ! r.zip.files["chapters/" + chapterCode + ".txt.md"] ) break;
			
			currChapter++;
			
			try {
				var chapterMetadata = JSON.parse(r.zip.files["chapters/" + chapterCode + ".txt.md"].asText());
				r.chapters.push({
					id: currChapter,
					chapterCode: chapterCode,
					title: chapterMetadata.name,
					text: r.zip.files["chapters/" + chapterCode + ".txt"].asText()
				});
			}
			catch(e){
				throw "Error parsing metadata for chapter " + chapterCode + ": " + e;
			}
		}
		
		r.setChapterName = function(chapter, name, callback){
			if( ! r.zip.files["chapters/" + chapter + ".txt.md"] ) throw "Chapter doesn't exist";
			r.zip.file("chapters/" + chapter + ".txt.md", JSON.stringify({name: name}));
			fs.writeFile(r.file, zip.generate({type: "string"}), {encoding: "binary"}, callback);
		}
		
		r.setChapterText = function(chapter, text, callback){
			if( ! r.zip.files["chapters/" + chapter + ".txt"] ) throw "Chapter doesn't exist";
			r.zip.file("chapters/" + chapter + ".txt", text);
			fs.writeFile(r.file, zip.generate({type: "string"}), {encoding: "binary"}, callback);
		}
		
		r.numChapters = currChapter+1;
		r.lastChapterID = currChapter;
		
		callback(r);
	});
}
