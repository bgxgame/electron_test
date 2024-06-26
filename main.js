const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
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
    } else {
        return ""
    }
}


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // ���˽ű����ӵ���Ⱦ������
            preload: path.join(__dirname, './backed/preload.js')
        }
    });

    // �� IPC ��Ϣ�������̷��͵�Ŀ����Ⱦ��
    const menu = Menu.buildFromTemplate([
        {
            label: "main2sub",
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
        },
        {
            label: "main2sub",
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

// ֻ���� app ģ��� ready �¼�����������ܴ������������
app.whenReady().then(() => {
    // IPC ��Ⱦ���̵�������
    ipcMain.on('set-title', handleSetTitle)
    // IPC ˫��
    ipcMain.handle('dialog:openFile', handleFileOpen)
    // IPC �����̵���Ⱦ���̵� + �ص�
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value)  
    })

    createWindow();
    console.log("app start ...");
    // ����ֱ�����������б༭DOM����Ϊ���޷�������Ⱦ�� �ĵ� ������ ������˵process������ʲ���
    // for (const dependency of ['chrome', 'node', 'electron']) {
    //     console.log(process.versions[dependency]);
    // }

    // ���û�д��ڴ����һ������ (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

// �ر����д���ʱ�˳�Ӧ��
app.on('window-all-closed', () => {
    // ����û������� macOS(darwin) �����г�������� app.quit()��
    if (process.platform !== 'darwin') app.quit();
})