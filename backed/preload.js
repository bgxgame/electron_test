// Ԥ���ؽű�����Ⱦ�� ʹ�� contextBridge ģ������ȫ��ʵ�ֽ���
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})