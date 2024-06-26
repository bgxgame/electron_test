// Ԥ���ؽű�����Ⱦ�����̼���֮ǰ���أ�����Ȩ�������� ��Ⱦ��ȫ�� (���� window �� document) �� Node.js ������
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

// Ԥ���ؽű�����Ⱦ�� ʹ�� contextBridge ģ������ȫ��ʵ�ֽ���
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    desktop: true
})