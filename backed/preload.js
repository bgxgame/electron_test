// 预加载脚本与渲染器 使用 contextBridge 模块来安全地实现交互
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})

contextBridge.exposeInMainWorld('electronAPI2', {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
})

// 加载预加载脚本后，渲染器进程应有权访问 window.electronAPI.onUpdateCounter() 监听器函数。
contextBridge.exposeInMainWorld('electronAPI3', {
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
    counterValue: (value) => ipcRenderer.send('counter-value', value)
})