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