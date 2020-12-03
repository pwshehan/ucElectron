const { BrowserWindow } = require("electron");
const electron = require("electron");

const { app } = electron;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
