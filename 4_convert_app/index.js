const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const _ = require("lodash");
const path = require("path");

const { app, BrowserWindow, ipcMain, shell } = electron;
let mainWindow;

ffmpeg.setFfprobePath("C:\\src\\ffmpeg\\bin\\ffprobe.exe");
ffmpeg.setFfmpegPath("C:\\src\\ffmpeg\\bin\\ffmpeg.exe");

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, backgroundThrottling: false },
    height: 600,
    width: 800,
  });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on("videos:added", (event, videos) => {
  const promises = _.map(videos, (video) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        video.duration = metadata.format.duration;
        video.format = "avi";
        resolve(video);
      });
    });
  });

  Promise.all(promises).then((results) => {
    mainWindow.webContents.send("metadata:complete", results);
  });
});

ipcMain.on("conversion:start", (event, videos) => {
  _.each(videos, (video) => {
    const pathData = path.parse(video.path);
    const outputPath = path.normalize(
      `${pathData.dir}/${pathData.name}.${video.format}`
    );

    ffmpeg(video.path)
      .output(outputPath)
      .on("progress", ({ timemark }) => {
        mainWindow.webContents.send("conversion:progress", { video, timemark });
      })
      .on("end", () => {
        mainWindow.webContents.send("conversion:end", {
          video,
          outputPath,
        });
      })
      .run();
  });
});

ipcMain.on("folder:open", (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
