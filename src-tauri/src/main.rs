// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    let menu = Menu::new()
        .add_submenu(Submenu::new(
          "App",
          Menu::new()
            .add_item(CustomMenuItem::new("about", "About"))
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
            .add_item(CustomMenuItem::new("new", "New Project").accelerator("CmdOrCtrl+N").disabled())
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
        .setup(|app| {
            Ok(())
        })
        .menu(menu)
        .on_menu_event(|event| {
          match event.menu_item_id() {
            "about" => {
                let window = event.window().clone();
                let about_window = window.get_window("about").unwrap();
                about_window.show();
                println!("It works!");
            }
            _ => {}
          }
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
