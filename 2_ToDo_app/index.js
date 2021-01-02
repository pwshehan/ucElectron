const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(munuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add new Todo",
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
}

const munuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Quit",
        // accelerator: (() => {
        //   if (process.platform === "darwin") {
        //     return "Command+Q";
        //   } else {
        //     return "Ctrl+Q";
        //   }
        // })(),
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform == "darwin") {
  //Add empty object if macOS
  munuTemplate.unshift({});
}
