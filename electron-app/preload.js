const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runFacebookLogin: (accountData) => ipcRenderer.invoke('run-facebook-login', accountData),
  startAutomationTask: (taskData) => ipcRenderer.invoke('start-automation-task', taskData),
  stopAutomationTask: (data) => ipcRenderer.invoke('stop-automation-task', data),
  getActiveBrowsers: () => ipcRenderer.invoke('get-active-browsers'),
  isDesktopApp: true
});
