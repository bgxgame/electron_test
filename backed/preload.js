// Ԥ���ؽű�����Ⱦ�� ʹ�� contextBridge ģ������ȫ��ʵ�ֽ���
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})

contextBridge.exposeInMainWorld('electronAPI2', {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
})

// ����Ԥ���ؽű�����Ⱦ������Ӧ��Ȩ���� window.electronAPI.onUpdateCounter() ������������
contextBridge.exposeInMainWorld('electronAPI3', {
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
    counterValue: (value) => ipcRenderer.send('counter-value', value)
})