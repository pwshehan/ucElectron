const electron = require("electron");
const { Tray } = electron;

class TimerTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath);

    this.mainWindow = mainWindow;
    this.on("click", this.onClick.bind(this));
  }

  onClick(event, bounds) {
    //click event bound
    const { x, y } = bounds;

    //window height and width
    const { height, width } = this.mainWindow.getBounds();

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      const yPosition = process.platform === "darwin" ? y : y - height;
      this.mainWindow.setBounds({
        x: x - Number.parseFloat(width / 2).toFixed(0),
        y: yPosition,
        height,
        width,
      });
      this.mainWindow.show();
    }
  }
}

module.exports = TimerTray;