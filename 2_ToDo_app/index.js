const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on("closed", () => app.quit());

  const mainMenu = Menu.buildFromTemplate(munuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 300,
    height: 200,
    title: "Add new Todo",
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on("closed", () => (addWindow = null));
}

function clearTodos() {
  mainWindow.webContents.send("todo:clear");
}

ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  if (addWindow) {
    addWindow.close();
  }
});

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
        label: "Clear Todos",
        click() {
          clearTodos();
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

if (process.env.NODE_ENV !== "production") {
  munuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
