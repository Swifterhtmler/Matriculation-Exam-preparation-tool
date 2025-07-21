import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { fileURLToPath } from 'url';
import fs from 'fs'
import { OpenAI } from 'openai';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(app.getPath('userData'), 'saved.json');

// ipcMain.handle('openai-chat', async (event, { messages }) => {
//   try {
//     const result = await api.chat.completions.create({
//       model: 'google/gemma-3n-e4b-it',
//       messages,
//     });
//     return result.choices[0].message.content;
//   } catch (err) {
//     console.error("OpenAI API error:", err);
//     throw new Error(err.message || "Unknown error");
//   }
// });

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  } else {
    mainWindow.loadFile(
      path.join(
        import.meta.dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      ),
    );
  }
};


ipcMain.handle('save-file', (event, data) => {
  console.log('Saving to:', dataPath);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return true;
});

ipcMain.handle('load-file', async () => {
  console.log('Trying to load file:', dataPath);
  if (fs.existsSync(dataPath)) {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } else {
    // Return the default structure your Svelte app expects
    return {
      todoItems: { Kemia: [], matematiikka: [] },
      cards: {},
      motivationval: [],
      editorText: ''
    };
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
