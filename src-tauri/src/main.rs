// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    let menu = Menu::new()
        .add_submenu(Submenu::new(
          "App",
          Menu::new()
            .add_item(CustomMenuItem::new("about", "About").disabled())
            .add_item(CustomMenuItem::new("updates", "Check for Updates").disabled())
            .add_item(CustomMenuItem::new("changelog", "Changelog").disabled())
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("settings", "Settings").disabled())
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
        ))
        .add_submenu(Submenu::new(
          "File",
          Menu::new()
            .add_item(CustomMenuItem::new("new", "New Project").disabled())
            .add_native_item(MenuItem::CloseWindow)
        ))
        .add_submenu(Submenu::new(
          "View",
          Menu::new()
            .add_item(CustomMenuItem::new("preview", "Preview").disabled())
            .add_native_item(MenuItem::CloseWindow)
        ))
        .add_submenu(Submenu::new(
          "Help",
          Menu::new()
            .add_item(CustomMenuItem::new("help", "Documentation").disabled())
        ));



    tauri::Builder::default()
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
