const btn3 = document.getElementById('btn3')
const input = document.getElementById('input1')

btn3.addEventListener('click', () => {
    window.electronAPI4.saveFile(input.value)
})

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
})

const btn2 = document.getElementById('btn2')
const filePathElement = document.getElementById('filePath')

btn2.addEventListener('click', async () => {
    const filePath = await window.electronAPI2.openFile()
    filePathElement.innerText = filePath
})

const counter = document.getElementById('counter')

window.electronAPI3.onUpdateCounter((value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue.toString()
    window.electronAPI3.counterValue(newValue)
})

// 读取D盘中的hello.txt
const btn4 = document.getElementById('btn4')
btn4.addEventListener('click', async () => {
    let data = await window.electronAPI4.readFile()
    alert(data);
})