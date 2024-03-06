import { imposePDF } from '/lib/impose.js'
import { $ } from '/lib/dom.js'

const { WebviewWindow } = window.__TAURI__.window
const { save } = window.__TAURI__.dialog
const {
  writeBinaryFile
} = window.__TAURI__.fs

const bc_preview = new BroadcastChannel("preview_channel")

const imposeFile = async (uint8arr, length) => {
  console.log('start loading state')
  // pass options to the imposer
  // the DOM is the state, its fine
  const imposeX = $('simp:imposeX').value
  const imposeY = $('simp:imposeY').value
  const signatures = $('simp:signatures').value
  // x times y pages per side, 2 sides per leaf,
  const pagesPerSheet = imposeX * imposeY * 2
  const sheets = length / pagesPerSheet
  const sheetsPerSignature = sheets / signatures
  console.log('do work')
  const outFile = await imposePDF({
    data: uint8arr,
    signatures: sheetsPerSignature,
    imposeX,
    imposeY
  })
  console.log('catch errors')
  console.log('end loading state')
  return outFile
}

export const previewPDF = async (uint8arr, length) => {
  const previewWindow = WebviewWindow.getByLabel('preview')
  previewWindow.show()

  const outFile = await imposeFile(uint8arr, length)
  bc_preview.postMessage(outFile)
}

export const savePDF = async (uint8arr, length) => {
  const outFile = await imposeFile(uint8arr, length)
  const filePath = await save({
    filters: [{
      name: 'File',
      extensions: ['pdf']
    }]
  });
  await writeBinaryFile(filePath, outFile, { path: filePath })
}

export const embedPDF = (src) => {
  const body = document.querySelector("body")
  const template = document.querySelector("#preview")
  const clone = template.content.cloneNode(true)
  clone.querySelector("embed").setAttribute("src", src);
  body.appendChild(clone)
}