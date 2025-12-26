#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use std::sync::Mutex;

struct AppState {
    is_recording: Mutex<bool>,
}

#[tauri::command]
fn start_recording(state: tauri::State<AppState>) -> Result<String, String> {
    let mut is_recording = state.is_recording.lock().unwrap();
    *is_recording = true;
    Ok("Recording started".to_string())
}

#[tauri::command]
fn stop_recording(state: tauri::State<AppState>) -> Result<String, String> {
    let mut is_recording = state.is_recording.lock().unwrap();
    *is_recording = false;
    Ok("Recording stopped".to_string())
}

#[tauri::command]
fn get_recording_state(state: tauri::State<AppState>) -> Result<bool, String> {
    let is_recording = state.is_recording.lock().unwrap();
    Ok(*is_recording)
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            is_recording: Mutex::new(false),
        })
        .invoke_handler(tauri::generate_handler![
            start_recording,
            stop_recording,
            get_recording_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}