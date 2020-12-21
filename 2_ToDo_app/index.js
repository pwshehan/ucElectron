const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(munuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const munuTemplate = [
  {
    label: "File",
    submenu: [{ label: "New Todo" }],
  },
];
