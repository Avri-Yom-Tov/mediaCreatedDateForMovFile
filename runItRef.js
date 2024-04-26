// השתמש בסקריפט הזה אחרי המרה מקובץ מוב לפורמט אם פי 4 כדי להמיר תמונות השתמש בתוכנה

// XnConvert
// שם אל תשכח כמובן לסמן המרה עם שמירת התאריך ..

/// לפני !!!!!!!!!!! תמיר דרך התוכנה ..

// Video Converter תשתמש בתוכנה הזו  - -

// יכול להיות בהתחלה זורק שגיאות משונות , תעשה אתחול למחשב אמור לסדר את זה אחרי פעם פעמיים

// בהצלחה

const fs = require("fs").promises;
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const ffprobeStatic = require("ffprobe-static");
ffmpeg.setFfprobePath(ffprobeStatic.path);

const folderPath = "C:\\Users\\avrahamy\\Desktop\\VID";
const folderMp4 = "C:\\Users\\avrahamy\\Desktop\\Format Convert";

const getVideoData = async () => {
  try {
    const files = await fs.readdir(folderPath);
    const videoData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        try {
          const metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
              if (err) {
                console.error("Error occurred while fetching metadata: ", err);
                reject(err);
              } else {
                resolve(metadata);
              }
            });
          });
          const creationTime = metadata.format.tags?.creation_time;
          console.log(`MOV - File name: ${file}, Creation time: ${creationTime}`);
          return { name: file, creationTime };
        } catch (err) {
          console.error(`Error processing file ${file}: ${err}`);
          return null;
        }
      })
    );

    return videoData.filter((item) => item && item.name !== "desktop.ini");
  } catch (err) {
    console.error("An error occurred while reading the directory: ", err);
    return [];
  }
};

const updateMetadata = async (videoData) => {
  for (let fileInfo of videoData) {
    const finalName = fileInfo.name.replace(".MOV", ".mp4");
    const creationDate = new Date(fileInfo.creationTime);
    const exiftoolDate = creationDate.toISOString().replace(/:/g, "-").split(".")[0].replace("T", " ");
    const filePath = path.join(folderMp4, finalName);

    const command = `exiftool -overwrite_original -CreateDate="${exiftoolDate}" "${filePath}"`;
    exec(command, (err) => {
      if (err) {
        console.error(`Error updating metadata for ${finalName}: ${err.message}`);
      } else {
        console.log(`Successfully updated metadata for ${finalName}`);
      }
    });
  }
};

const processVideos = async () => {
  const videoData = await getVideoData();
  console.log(`Processing ${videoData.length} files .`);
  await updateMetadata(videoData);
};

processVideos();
