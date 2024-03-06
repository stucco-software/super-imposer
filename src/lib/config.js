const { appConfigDir } = window.__TAURI__.path
const {
  writeTextFile,
  createDir,
  exists
} = window.__TAURI__.fs

export const getAppConfigPath = async () => {
  const appConfigDirPath = await appConfigDir()
  const appConfigFilePath = `${appConfigDirPath}config.json`
  return appConfigFilePath
}

export const defaultsObj = {
  "@context": "https://super-imposer.stucco.software/vocabulary",
  signatures: 1,
  imposeX: 2,
  imposeY: 1
}

const writeDefaultConfig = async (filePath) => {
  const stringified = JSON.stringify(defaultsObj)
  await writeTextFile(filePath, stringified, { path: filePath })
}

export const loadConfig = async (configObj) => {
  const keys = Object.keys(configObj)
  keys.forEach(key => {
    localStorage.setItem(key, configObj[key])
  })
}

export const saveConfig = async (filePath, obj) => {
  const stringified = JSON.stringify(obj)
  await writeTextFile(filePath, stringified, { path: filePath })
}

export const config = async () => {
  const appConfigDirPath = await appConfigDir()
  const appConfigFilePath = await getAppConfigPath()

  const configDirExists = await exists(appConfigDirPath)
  if (!configDirExists) {
    await createDir(appConfigDirPath)
  }

  const configFileExists = await exists(appConfigFilePath)
  if (!configFileExists) {
    await writeDefaultConfig(appConfigFilePath)
  }

  await loadConfig(appConfigFilePath)
}





