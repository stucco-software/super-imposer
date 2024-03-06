import { config, loadConfig } from '/lib/config.js'
import { $ } from '/lib/dom.js'
import { processFile } from '/lib/processor.js'
import {
  saveCurrentProject,
  openProject
} from '/lib/project.js'

const { WebviewWindow } = window.__TAURI__.window
const { listen } = window.__TAURI__.event

const bc_update_settings = new BroadcastChannel("settings_channel")

const main = async () => {
  // Uploaded file processor
  const sourceInput = $('simp:input')
  if (sourceInput)
    sourceInput.addEventListener('change', await processFile)

  // Show About Window on Button Click
  const aboutWindow = WebviewWindow.getByLabel('about')
  const showAbout = $('simp:showAbout')
  if (showAbout)
    showAbout.addEventListener('click', () => {
      aboutWindow.show()
    })

  // Set menu and hotkey listeners
  await listen('save_project', async (event) => {
    await saveCurrentProject()
  })
  await listen('save_project_as', async (event) => {
    await saveCurrentProject(true)
  })
  await listen('open_project', async (event) => {
    await openProject()
  })

  bc_update_settings.onmessage = (event) => {
    loadConfig(event.data)
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await config()
  main()
})