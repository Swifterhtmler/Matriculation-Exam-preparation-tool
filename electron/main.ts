import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { fileURLToPath } from 'url';
import fs from 'fs'

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

// Function to determine if running in portable mode
const isPortableMode = () => {
  // Method 1: Check for a portable.txt file next to the executable
  const portableMarkerFile = app.isPackaged 
    ? path.join(path.dirname(process.execPath), 'portable.txt')
    : path.join(__dirname, 'portable.txt');
  
  if (fs.existsSync(portableMarkerFile)) {
    return true;
  }
  
  // Method 2: Check command line arguments
  if (process.argv.includes('--portable')) {
    return true;
  }
  
  // Method 3: Check environment variable
  if (process.env.PORTABLE_MODE === 'true') {
    return true;
  }
  
  return false;
};

// Determine save location based on mode
const getSaveLocation = () => {
  if (isPortableMode()) {
    // Portable mode: save relative to executable/script directory
    console.log('Running in PORTABLE mode');
    const appDir = app.isPackaged 
      ? path.dirname(process.execPath)  // Packaged app: use executable directory
      : __dirname;                      // Development: use script directory
    
    return {
      mode: 'portable',
      saveFolder: path.join(appDir, "data"),
      dataPath: path.join(appDir, "data", 'saved.json')
    };
  } else {
    // Desktop mode: use system user data directory
    console.log('Running in DESKTOP mode');
    const userDataDir = app.getPath('userData');
    
    return {
      mode: 'desktop',
      saveFolder: path.join(userDataDir, "folder"),
      dataPath: path.join(userDataDir, "folder", 'saved.json')
    };
  }
};

const { mode, saveFolder, dataPath } = getSaveLocation();

console.log(`App Mode: ${mode.toUpperCase()}`);
console.log(`Save Folder: ${saveFolder}`);
console.log(`Data Path: ${dataPath}`);

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
  } catch (err) {
    if (err.message.includes('429') || err.message.includes('rate limit')) {
      throw new Error("Rate limit exceeded. Please wait and try again later.");
    }
    console.error("API error:", err);
    throw new Error(err.message || "Unknown error");
  }
});

// Add IPC handler to get current mode
ipcMain.handle('get-app-mode', () => {
  return {
    mode,
    saveFolder,
    dataPath
  };
});

ipcMain.handle('save-file', (event, data) => {
  if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder, { recursive: true });
  }
  console.log(`Saving to (${mode} mode):`, dataPath);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return true;
});

ipcMain.handle('load-file', async () => {
  console.log(`Trying to load file (${mode} mode):`, dataPath);
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