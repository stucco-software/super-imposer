import { $ } from '/lib/dom.js'
import { previewPDF, savePDF } from '/lib/pdf.js'
const { listen } = window.__TAURI__.event

const enablePreview = (uint8arr, length) => {
  const showPreview = $('simp:showPreview')
  showPreview.removeAttribute('disabled')
  showPreview.addEventListener('click', e => previewPDF(uint8arr, length))
}

const enableOutput = (uint8arr, length) => {
  const outputPDF = $('simp:outputPDF')
  outputPDF.removeAttribute('disabled')
  outputPDF.addEventListener('click', e => savePDF(uint8arr, length))
  listen('impose', e => savePDF(uint8arr, length))
}

const enableLayoutOptions = () => {
  console.log('enableLayoutOptions')
  // set default layout options & allow inputs
  const imposeX = $('simp:imposeX')
  const imposeY = $('simp:imposeY')
  imposeX.removeAttribute('disabled')
  imposeY.removeAttribute('disabled')
  if (imposeX.value == 0 || imposeX.value == '0')
    imposeX.value = Number(localStorage.getItem('imposeX'))
  if (imposeY.value == 0 || imposeY.value == '0')
    imposeY.value = Number(localStorage.getItem('imposeY'))

}

const displaySignatureSize = (size) => {
  console.log('displaySignatureSize', size)
  $('simp:pagesPerSignature').innerText = size
}

const enableSignatures = (length) => {
  console.log('enableSignatures')
  const signatureInput = $('simp:signatures')
  signatureInput.removeAttribute('disabled')
  if (signatureInput.value == 0 || signatureInput.value == '0')
    signatureInput.value = Number(localStorage.getItem('signatures'))

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
}

const showOptions = (uint8arr) => {
  console.log('show options')
  // convert to in-memory pdf
  const inPDF = coherentpdf.fromMemory(uint8arr, "")
  // count pages and display
  const length = coherentpdf.pages(inPDF)
  $('simp:inputLength').innerText = length

  // side effects!
  enableSignatures(length)
  enableLayoutOptions(uint8arr, length)
  enablePreview(uint8arr, length)
  enableOutput(uint8arr, length)
}

export const processFile = async e => {
  // Set Loading State
  console.log('set loading state')
  e.preventDefault()
  let file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    var arr = new Uint8Array(e.target.result)
    showOptions(arr)
    console.log('end loading state')
    // End Loading State
  }
  reader.readAsArrayBuffer(file)
}