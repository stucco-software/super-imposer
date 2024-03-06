import { defaultsObj, getAppConfigPath, saveConfig } from '/lib/config.js'

const bc_update_settings = new BroadcastChannel("settings_channel")

const saveDefaults = (defaultInputs) => async (e) => {
  console.log(defaultsObj)
  const appConfigFilePath = await getAppConfigPath()

  let values = {}
  defaultInputs.forEach(input => {
    values[input.name] = Number(input.value)
  })
  let newDefaults = Object.assign(defaultsObj, values)
  await saveConfig(appConfigFilePath, newDefaults)
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