const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");

const { app, BrowserWindow, ipcMain } = electron;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (event, path) => {
  console.log(path);
  ffmpeg.setFfprobePath("C:\\src\\ffmpeg\\bin\\ffprobe.exe");
  ffmpeg.ffprobe(path, (err, metadata) => {
    console.log("File duration is: ", metadata.format.duration);
  });
});
