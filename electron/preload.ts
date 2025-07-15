// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (data) => ipcRenderer.send('save-file', data),
  loadFile: () => ipcRenderer.invoke('load-file'),
  openFile: () => ipcRenderer.invoke('open-file'),
});

contextBridge.exposeInMainWorld('openaiAPI', {
  chat: async (messages) => ipcRenderer.invoke('openai-chat', { messages })
});