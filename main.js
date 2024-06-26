const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('node:path')

function handleSetTitle(event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    console.log("canceled", canceled);
    if (!canceled) {
        console.log("filePaths", filePaths);

        return filePaths[0]
    }else {
        return ""
    }
}


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 将此脚本附加到渲染器流程
            preload: path.join(__dirname, './backed/preload.js')
        }
    });
    win.loadFile('./pages/index.html');
}

// 只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    // IPC 渲染进程到主进程
    ipcMain.on('set-title', handleSetTitle)
    // IPC 双向
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow();
    console.log("app start ...");
    // 不能直接在主进程中编辑DOM，因为它无法访问渲染器 文档 上下文 而不是说process对象访问不了
    // for (const dependency of ['chrome', 'node', 'electron']) {
    //     console.log(process.versions[dependency]);
    // }

    // 如果没有窗口打开则打开一个窗口 (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
    // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
    if (process.platform !== 'darwin') app.quit();
})