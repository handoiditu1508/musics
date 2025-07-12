const fs = require('fs');
const mm = require('music-metadata');
const path = require('path');

const files = fs.readdirSync("../musics");

// store songs's information to write to filesList.json
const songInfos = [];
const tasks = [];

// write to filesList.js
const writeStream = fs.createWriteStream("filesList.js", { flags: "w" });
writeStream.write("const filesList=[");

files.forEach((file, index) => {
  // write to filesList.js
  if (index === files.length - 1) {
    writeStream.write(`"musics/${file}"`);
  } else {
    writeStream.write(`"musics/${file}",`);
  }

  // get song's information
  const filePath = path.join("../musics", file);
  const fileStats = fs.statSync(filePath);
  const task = mm.parseFile(filePath, { duration: true });
  tasks.push(task);
  task.then((metadata) => {
    const fileNameWithoutExt = path.basename(file, path.extname(file));

    songInfos.push({
      id: index + 1,
      name: file,
      title: metadata.common.title || "",
      artists: metadata.common.artists || [],
      size: fileStats.size,
      duration: metadata.format.duration,
      lyricsFile: fs.existsSync(`../lyrics/${fileNameWithoutExt}.txt`) ? `${fileNameWithoutExt}.txt` : undefined,
    });
  });
});

// write to filesList.js
writeStream.end("];");

// write to filesList.json
Promise.all(tasks).then(() => {
  songInfos.sort((a, b) => a.id - b.id);
  const jsonWriteStream = fs.createWriteStream("filesList.json", { flags: "w" });
  jsonWriteStream.write(JSON.stringify(songInfos));
  jsonWriteStream.end();
});
