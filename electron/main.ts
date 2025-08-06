import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { fileURLToPath } from 'url';
import fs from 'fs'
// import { OpenAI } from 'openai';

// import 'dotenv/config';

// import config from '../config.json' assert { type: "json" };



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


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userDataDir = app.getPath('userData');
const saveFolder = path.join(userDataDir, "folder");
const dataPath = path.join(saveFolder, 'saved.json');

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


// const api = new OpenAI({
//   baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
//   apiKey: config.OPENAI_API_KEY,
// });

// Handle chat requests from renderer
// ipcMain.handle('openai-chat', async (event, { messages }) => {
//   try {
//     const result = await api.chat.completions.create({
//       model: 'gemini-2.0-flash',
//       messages,
//     });
//     return result.choices[0].message.content;
//   } catch (err: any) {
//     // console.error("OpenAI API error:", err);
//     // throw new Error(err.message || "Unknown error");
//      if (err.status === 429) {
//       console.error("OpenAI API rate limit exceeded (429)");
//       throw new Error("Rate limit exceeded. Please wait and try again later.");
//     }
//     console.error("OpenAI API error:", err);
//     throw new Error(err.message || "Unknown error");
//   }
// });




ipcMain.handle('openai-chat', async (event, { messages }) => {
  try {
    const response = await fetch('https://matriculation-exam-preparation-tool-two.vercel.app/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data.choices[0].message.content;
  } catch (err: any) {
    if (err.message.includes('429') || err.message.includes('rate limit')) {
      throw new Error("Rate limit exceeded. Please wait and try again later.");
    }
    console.error("API error:", err);
    throw new Error(err.message || "Unknown error");
  }
});




ipcMain.handle('save-file', (event, data) => {
  if (!fs.existsSync(saveFolder)) {
  fs.mkdirSync(saveFolder, { recursive: true });
 }
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
