const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobeStatic.path);

// Do  ->> folderPath :

const folderPath = "C:\\Users\\avrahamy\\Desktop\\Img";

const outputPath = "Data.json";

const getMediaCreatedDate = async (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const mediaCreatedDate = metadata.format.tags.creation_time;
        resolve(mediaCreatedDate);
      }
    });
  });
};

const getMOVFilesData = async (dir) => {
  try {
    const files = await fs.promises.readdir(dir);
    const movFilesData = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const mediaCreatedDate = await getMediaCreatedDate(filePath);

      const fileData = {
        name: file,
        mediaCreatedDate: mediaCreatedDate,
      };
      movFilesData.push(fileData);
    }

    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(movFilesData, null, 2)
    );
    return movFilesData;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
};

getMOVFilesData(folderPath);


