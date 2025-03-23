const fs = require('fs');

const files = fs.readdirSync("../musics");

const writeStream = fs.createWriteStream("filesList.js", { flags: "w" });
writeStream.write("const filesList=[");
files.forEach((file, index) => {
  if (index === files.length - 1) {
    writeStream.write(`"musics/${file}"`);
  } else {
    writeStream.write(`"musics/${file}",`);
  }
});
writeStream.end("];");

const jsonWriteStream = fs.createWriteStream("filesList.json", { flags: "w" });
jsonWriteStream.write(JSON.stringify(files));
jsonWriteStream.end();
