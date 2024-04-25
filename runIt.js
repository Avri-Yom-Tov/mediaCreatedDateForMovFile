
// השתמש בסקריפט הזה אחרי המרה מקובץ מוב לפורמט אם פי 4 כדי להמיר תמונות השתמש בתוכנה  

// XnConvert
// שם אל תשכח כמובן לסמן המרה עם שמירת התאריך ..



/// לפני !!!!!!!!!!! תמיר דרך התוכנה ..

// Video Converter תשתמש בתוכנה הזו  - - 

// יכול להיות בהתחלה זורק שגיאות משונות , תעשה אתחול למחשב אמור לסדר את זה אחרי פעם פעמיים 

// בהצלחה 
const fs = require('fs');
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const ffprobeStatic = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const folderPath = "C:\\Users\\avrahamy\\Desktop\\VID";
const folderMp4 = "C:\\Users\\avrahamy\\Desktop\\Format Convert";
let videoData = [];

fs.readdir(folderPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }


  console.log("files length in dir : ", files.length - 1);
  Promise.all(files.map(function (file) {
    const filePath = `${folderPath}/${file}`;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, function (err, metadata) {
        if (err) {
          console.error('Error occurred while fetching metadata: ', err);
          reject(err);
        } else {
          const creationTime = metadata.format.tags?.creation_time;
          videoData.push({
            name: file,
            creationTime: creationTime,
          });

          console.log(`MOV - File name: ${file}, Creation time: ${creationTime}`);
          resolve();
        }
      });
    });
  })).then(() => {
    console.log(`All files Sum is : ${videoData.length}`);
    const filterDesktopIniFile = videoData.filter((fileInfo) => fileInfo.name !== "desktop.ini");
    let count = 0;
    console.log(JSON.stringify(filterDesktopIniFile, null, 2));
    filterDesktopIniFile.forEach((fileInfo) => {
      console.log(fileInfo);
      const finalName = fileInfo.name.replace(".MOV", ".mp4");
      let creationDate = new Date(fileInfo.creationTime);
      let exiftoolDate = creationDate.toISOString().replace(/:/g, '-').split('.')[0].replace('T', ' ');
      const filePath = path.join(folderMp4, finalName);
      console.log(`mp4 - File name: ${fileInfo.name}`);
      const command = `exiftool -overwrite_original -CreateDate="${exiftoolDate}" "${filePath}"`;

      exec(command, (err) => {
        if (err) {
          console.error(`Error updating metadata for ${finalName}: ${err.message} `);
        } else {
          count = count + 1;
          console.log(`Successfully updated metadata for ${finalName} !!  File count : ${count} `);
        }
      });
    });
  }).catch((err) => {
    console.error('An error occurred: ', err);
  });
});





let r = ["ile name: MVI_2385.MOV, Creation time: 2024-04-24T07:06:46.000000Z",
  "ile name: MVI_2374.MOV, Creation time: 2024-04-24T06:51:19.000000Z",
  "ile name: MVI_2371.MOV, Creation time: 2024-04-24T06:49:45.000000Z",
  "ile name: MVI_2370.MOV, Creation time: 2024-04-24T06:47:04.000000Z",
  "ile name: MVI_2362.MOV, Creation time: 2024-04-24T06:31:23.000000Z",
  "ile name: MVI_2306.MOV, Creation time: 2024-04-19T06:07:07.000000Z",
  "ile name: MVI_2305.MOV, Creation time: 2024-04-19T06:04:15.000000Z",
  "ile name: MVI_2304.MOV, Creation time: 2024-04-15T08:47:46.000000Z",
  "ile name: MVI_2300.MOV, Creation time: 2024-04-13T20:20:04.000000Z",
  "ile name: MVI_2296.MOV, Creation time: 2024-03-27T13:58:53.000000Z",
  "ile name: MVI_2295.MOV, Creation time: 2024-03-27T13:58:21.000000Z",
  "ile name: MVI_2281.MOV, Creation time: 2024-03-25T13:39:05.000000Z",
  "ile name: MVI_2266.MOV, Creation time: 2024-03-24T15:18:23.000000Z",
  "ile name: MVI_2221.MOV, Creation time: 2024-03-24T06:57:43.000000Z",
  "ile name: MVI_2209.MOV, Creation time: 2024-03-21T06:22:42.000000Z",
  "ile name: MVI_2206.MOV, Creation time: 2024-03-20T16:20:40.000000Z",
  "ile name: MVI_2205.MOV, Creation time: 2024-03-20T15:51:28.000000Z",
  "ile name: MVI_2184.MOV, Creation time: 2024-03-17T07:16:44.000000Z",
  "ile name: MVI_2180.MOV, Creation time: 2024-03-15T13:33:34.000000Z",
  "ile name: MVI_2170.MOV, Creation time: 2024-03-14T14:27:09.000000Z",]