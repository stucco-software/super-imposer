import { imposePDF } from './Impose.js'
const { invoke } = window.__TAURI__.tauri
const { save } = window.__TAURI__.dialog
const { writeBinaryFile } = window.__TAURI__.fs

const defaults = new Map([
  ['signatures', 1],
  ['imposeX', 2],
  ['imposeY', 1],
])

const $ = (p) => document.querySelector(`[name="${p}"]`) || document.querySelector(`[property="${p}"]`)

const saveFile = async (outFile) => {
  const filePath = await save({
    filters: [{
      name: 'File',
      extensions: ['pdf']
    }]
  });
  await writeBinaryFile(filePath, outFile, { path: filePath })
}

const displaySignatureSize = (size) => {
  $('simp:pagesPerSignature').innerText = size
}

const savePDF = async (uint8arr, pages) => {
  // pass options to the imposer
  // the DOM is a the state, its fine
  const imposeX = $('simp:imposeX').value
  const imposeY = $('simp:imposeY').value
  const signatures = $('simp:outputSignatures').value
  // x times y pages per side, 2 sides per leaf,
  const pagesPerSheet = imposeX * imposeY * 2
  const sheets = pages / pagesPerSheet
  const sheetsPerSignature = sheets / signatures
  const outFile = imposePDF({
    data: uint8arr,
    signatures: sheetsPerSignature,
    imposeX,
    imposeY
  })
  await saveFile(outFile)
  console.log(`done!`)
}

const showOptions = (uint8arr) => {
  // convert to in-memory pdf
  const inPDF = coherentpdf.fromMemory(uint8arr, "")

  // count pages and display
  const length = coherentpdf.pages(inPDF)
  $('simp:inputLength').innerText = length

  // set default signatures & allow inputs
  const signatureInput = $('simp:outputSignatures')
  signatureInput.removeAttribute('disabled')
  signatureInput.value = defaults.get('signatures')

  // Calcute signature sizes
  let signatures = signatureInput.value
  let pagesPerSignature = length / signatures
  displaySignatureSize(pagesPerSignature)

  // Handle page changes
  signatureInput.addEventListener('change', (e) => {
    const signatures = e.target.value
    const pagesPerSignature = length / signatures
    // TODO: handle signature uneveness
    displaySignatureSize(pagesPerSignature)
  })

  // set default layout options & allow inputs
  const imposeX = $('simp:imposeX')
  const imposeY = $('simp:imposeY')
  imposeX.removeAttribute('disabled')
  imposeY.removeAttribute('disabled')
  imposeX.value = defaults.get('imposeX')
  imposeY.value = defaults.get('imposeY')

  // TODO: allow project saves
  // const saveConfig = $('simp:saveConfig')
  // saveConfig.removeAttribute('disabled')

  // TODO: enable pdf preview
  // const showPreview = $('simp:showPreview')
  // showPreview.removeAttribute('disabled')

  const outputPDF = $('simp:outputPDF')
  outputPDF.removeAttribute('disabled')
  outputPDF.addEventListener('click', e => savePDF(uint8arr, length))
}

const processFile = async e => {
  e.preventDefault()
  let file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    var arr = new Uint8Array(e.target.result)
    showOptions(arr)
  }
  reader.readAsArrayBuffer(file)
}

const main = async () => {
  // const form = document.querySelector('form')
  // form.addEventListener('submit', await processFile)
  const sourceInput = $('simp:input')
  sourceInput.addEventListener('change', await processFile)
}

window.addEventListener("DOMContentLoaded", () => {
  main()
})
