const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getCredentials: () => ipcRenderer.invoke('get-credentials'),
});
