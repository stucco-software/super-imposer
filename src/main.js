import { imposePDF } from './Impose.js'
const { invoke } = window.__TAURI__.tauri
const { save, open } = window.__TAURI__.dialog
const { writeBinaryFile, writeTextFile, readTextFile, createDir, exists } = window.__TAURI__.fs
const { WebviewWindow } = window.__TAURI__.window
const { appConfigDir } = window.__TAURI__.path
const { listen } = window.__TAURI__.event

const defaultsObj = {
  "@context": "https://super-imposer.stucco.software/vocabulary",
  signatures: 1,
  imposeX: 2,
  imposeY: 1
}

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

const writeDefaultConfig = async (filePath) => {
  const stringified = JSON.stringify(defaultsObj)
  await writeTextFile(filePath, stringified, { path: filePath })
}

const displaySignatureSize = (size) => {
  $('simp:pagesPerSignature').innerText = size
}

const bc_preview = new BroadcastChannel("preview_channel")

const imposeFile = (uint8arr, pages) => {
  // pass options to the imposer
  // the DOM is the state, its fine
  const imposeX = $('simp:imposeX').value
  const imposeY = $('simp:imposeY').value
  const signatures = $('simp:signatures').value
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
  return outFile
}

const previewWindow = WebviewWindow.getByLabel('preview')
const previewPDF = async (uint8arr, pages) => {
  previewWindow.show()
  const outFile = imposeFile(uint8arr, pages)
  bc_preview.postMessage(outFile)
}

const savePDF = async (uint8arr, pages) => {
  const outFile = imposeFile(uint8arr, pages)
  await saveFile(outFile)
}

const showOptions = (uint8arr) => {
  // convert to in-memory pdf
  const inPDF = coherentpdf.fromMemory(uint8arr, "")

  // count pages and display
  const length = coherentpdf.pages(inPDF)
  $('simp:inputLength').innerText = length

  // set default signatures & allow inputs
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

  // set default layout options & allow inputs
  const imposeX = $('simp:imposeX')
  const imposeY = $('simp:imposeY')
  imposeX.removeAttribute('disabled')
  imposeY.removeAttribute('disabled')
  if (imposeX.value == 0 || imposeX.value == '0')
    imposeX.value = Number(localStorage.getItem('imposeX'))
  if (imposeY.value == 0 || imposeY.value == '0')
    imposeY.value = Number(localStorage.getItem('imposeY'))

  // TODO: enable pdf preview
  const showPreview = $('simp:showPreview')
  showPreview.removeAttribute('disabled')
  showPreview.addEventListener('click', e => previewPDF(uint8arr, length))

  const outputPDF = $('simp:outputPDF')
  outputPDF.removeAttribute('disabled')
  outputPDF.addEventListener('click', e => savePDF(uint8arr, length))
  listen('impose', e => savePDF(uint8arr, length))
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

const saveConfig = async (filePath, obj) => {
  const stringified = JSON.stringify(obj)
  await writeTextFile(filePath, stringified, { path: filePath })
}

const bc_update_settings = new BroadcastChannel("settings_channel")

const loadConfig = async (configObj) => {
  const keys = Object.keys(configObj)
  keys.forEach(key => {
    localStorage.setItem(key, configObj[key])
  })
}

const readConfig = async (configPath) => {
  const config = await readTextFile(configPath)
  const configObj = JSON.parse(config)
  loadConfig(configObj)
}

bc_update_settings.onmessage = (event) => {
  loadConfig(event.data)
}

const saveCurrentProject = async (newSave = false) => {
  let projectPath = $('simp:projectFilePath').value
  const signatures = $('simp:signatures').value
  const imposeX = $('simp:imposeX').value
  const imposeY = $('simp:imposeY').value

  if (projectPath.length === 0 || newSave) {
    projectPath = await save({
      filters: [{
        name: 'File',
        extensions: ['simp']
      }]
    });
    $('simp:projectFilePath').value = projectPath
  }

  const projectConfig = {
    "@context": "https://super-imposer.stucco.software/vocabulary",
    projectPath: projectPath,
    signatures: signatures,
    imposeX: imposeX,
    imposeY: imposeY
  }
  await saveConfig(projectPath, projectConfig)
}

const setProjectValues = (obj) => {
  let keys = Object.keys(obj)
  keys.forEach(key => {
    let input = $(`simp:${key}`)
    if (input)
      input.value = obj[key]
  })
}

const openProject = async () => {
  const projectPath = await open({
    filters: [{
      name: 'File',
      extensions: ['simp']
    }]
  });
  const projectConfig = await readTextFile(projectPath)
  const projectObj = JSON.parse(projectConfig)
  setProjectValues(projectObj)
}

const main = async () => {
  const sourceInput = $('simp:input')
  if (sourceInput)
    sourceInput.addEventListener('change', await processFile)

  const aboutWindow = WebviewWindow.getByLabel('about')
  const showAbout = $('simp:showAbout')
  if (showAbout)
    showAbout.addEventListener('click', () => {
      aboutWindow.show()
    })

  // TODO: Could be combined?
  const unlistenSave = await listen('save_project', async (event) => {
    await saveCurrentProject()
  })
  const unlistenSaveAs = await listen('save_project_as', async (event) => {
    await saveCurrentProject(true)
  })

  const unlistenOpen = await listen('open_project', async (event) => {
    await openProject()
  })
}

window.addEventListener("DOMContentLoaded", async () => {

  // TODO: Could be refactored out of this module
  const appConfigDirPath = await appConfigDir()
  const configDirExists = await exists(appConfigDirPath)
  if (!configDirExists) {
    await createDir(appConfigDirPath)
  }
  const configFileExists = await exists(`${appConfigDirPath}config.json`)
  if (!configFileExists) {
    await writeDefaultConfig(`${appConfigDirPath}config.json`)
  }

  await loadConfig(`${appConfigDirPath}config.json`)
  main()
})
