import { imposePDF } from './Impose.js'
const { invoke } = window.__TAURI__.tauri
const { save } = window.__TAURI__.dialog
const { writeBinaryFile } = window.__TAURI__.fs

const saveFile = async (outFile) => {
  const filePath = await save({
    filters: [{
      name: 'File',
      extensions: ['pdf']
    }]
  });
  await writeBinaryFile(filePath, outFile, { path: filePath })
}

const processFile = async e => {
  e.preventDefault()
  let file = e.target[0].files[0]
  const reader = new FileReader();
  reader.onload = async (e) => {
    var arr = new Uint8Array(e.target.result)
    const outFile = imposePDF({data: arr})
    await saveFile(outFile)
  };
  reader.readAsArrayBuffer(file);
}

const main = async () => {
  // const form = document.querySelector('form')
  // form.addEventListener('submit', await processFile)
}

window.addEventListener("DOMContentLoaded", () => {
  main()
})
