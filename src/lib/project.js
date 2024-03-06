import { saveConfig } from '/lib/config.js'
const { save, open } = window.__TAURI__.dialog
const { readTextFile } = window.__TAURI__.fs

const setProjectValues = (obj) => {
  let keys = Object.keys(obj)
  keys.forEach(key => {
    let input = $(`simp:${key}`)
    if (input)
      input.value = obj[key]
  })
}

export const openProject = async () => {
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

export const saveCurrentProject = async (newSave = false) => {
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