

// השתמש בסקריפט הזה אחרי המרה מקובץ מוב לפורמט אם פי 4 כדי להמיר תמונות השתמש בתוכנה  
// XnConvert
// שם אל תשכח כמובן לסמן המרה עם שמירת התאריך ..
// התוכנה הזו
// HandBrake 
// ממירה לקובץ אם פי 4 ומשנה את השם, יש שינוי קטן בקוד להתגבר על זה, עבור על זה בבקשה לפני ההפעלה
// בהצלחה 
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");
const path = require("path");
const { exec } = require("child_process");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const folderPath = "C:\\Users\\avrahamy\\Desktop\\Vid";
const folderMp4 = "C:\\Users\\avrahamy\\Desktop\\Mp4";
let videoData = [];

fs.readdir(folderPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  Promise.all(files.map(function (file) {
    const filePath = `${folderPath}/${file}`;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, function (err, metadata) {
        if (err) {
          console.error('Error occurred while fetching metadata: ', err);
          reject(err);
        } else {
          const creationTime = metadata.format.tags.creation_time;
          videoData.push({
            name: file,
            creationTime: creationTime,
          });

          console.log(`File name: ${file}, Creation time: ${creationTime}`);
          resolve();
        }
      });
    });
  })).then(() => {
    videoData.forEach((fileInfo) => {
      let baseName = fileInfo.name.split('_').join(' ').toLowerCase();
      let nameAndExt = baseName.split('.');
      let namePart = nameAndExt[0].charAt(0).toUpperCase() + nameAndExt[0].slice(1);
      let extPart = "mp4";
      let finalName = namePart + '.' + extPart;
      // Outputs: "Mvi 1119.mp4"
      let creationDate = new Date(fileInfo.creationTime);
      let exiftoolDate = creationDate.toISOString().replace(/:/g, '-').split('.')[0].replace('T', ' ');
      const filePath = path.join(folderMp4, finalName);
      const command = `exiftool -overwrite_original -CreateDate="${exiftoolDate}" "${filePath}"`;

      exec(command, (err) => {
        if (err) {
          console.error(`Error updating metadata for ${finalName}: ${err.message}`);
        } else {
          console.log(`Successfully updated metadata for ${finalName}`);
        }
      });
    });
  }).catch((err) => {
    console.error('An error occurred: ', err);
  });
});
