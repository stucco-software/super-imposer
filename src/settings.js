const { appConfigDir } = window.__TAURI__.path
const { writeTextFile } = window.__TAURI__.fs

const bc_update_settings = new BroadcastChannel("settings_channel")

const defaultsObj = {
  "@context": "https://super-imposer.stucco.software/vocabulary"
}

const saveConfig = async (filePath, obj) => {
  const stringified = JSON.stringify(obj)
  await writeTextFile(filePath, stringified, { path: filePath })
}

const saveDefaults = (defaultInputs) => async (e) => {
  const appConfigDirPath = await appConfigDir()
  let values = {}
  defaultInputs.forEach(input => {
    values[input.name] = Number(input.value)
  })
  let newDefaults = Object.assign(defaultsObj, values)
  await saveConfig(`${appConfigDirPath}config.json`, newDefaults)
  bc_update_settings.postMessage(newDefaults)
}

const main = async () => {
  const defaultInputs = [...document.querySelectorAll('.defaultInput')]
  const saveFn = saveDefaults(defaultInputs)
  defaultInputs.forEach(node => {
    node.value = Number(localStorage.getItem(node.name))
    node.addEventListener('change', saveFn)
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  main()
})