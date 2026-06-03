const { app, BrowserWindow } = require("electron");
const path = require("node:path");

function createWindow() {
  const fullscreen = process.env.PLAYER_MENU_FULLSCREEN !== "0";
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 576,
    backgroundColor: "#03060a",
    fullscreen,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devURL = process.env.PLAYER_MENU_URL;
  if (devURL) {
    window.loadURL(devURL);
    return;
  }

  window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
