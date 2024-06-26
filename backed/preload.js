// 预加载脚本与渲染器 使用 contextBridge 模块来安全地实现交互
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})