const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('fs')

function handleSetTitle(event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

function handleSaveFile(_, text) {
   console.log("text",text);
   if(text == "") console.log("请输入内容") 
   fs.writeFileSync('D:/hello.txt',text)
}

function readFile() {
    const res = fs.readFileSync('D:/hello.txt').toString();
    console.log("######",res);
    return res;
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    console.log("canceled", canceled);
    if (!canceled) {
        console.log("filePaths", filePaths);

        return filePaths[0]
    } else {
        return ""
    }
}


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 将此脚本附加到渲染器流程
            preload: path.join(__dirname, './backed/preload.js'),
            defaultFontFamily:"serif"
        }
    });

    // 将 IPC 消息从主进程发送到目标渲染器
    const menu = Menu.buildFromTemplate([
        {
            label: "update-counter",
            submenu: [
                {
                    click: () => win.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => win.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

    win.loadFile('./pages/index.html');
}

// 只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    process.env.LANG = 'zh-Hans';
    // IPC 渲染进程到主进程
    ipcMain.on('set-title', handleSetTitle)
    // 读取D盘中的hello.txt
    ipcMain.handle('file-read', readFile)
    // 将用户输入内容写入本机文件
    ipcMain.on('file-save', handleSaveFile)
    // IPC 双向
    ipcMain.handle('dialog:openFile', handleFileOpen)
    // IPC 主进程到渲染进程到 + 回调
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value)  
    })

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