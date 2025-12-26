# Wispr Flow Clone - Voice to Text Desktop App

A cross-platform desktop application for real-time voice-to-text transcription using Tauri, React, and Deepgram API.

## Features

- 🎤 Push-to-talk voice recording
- ⚡ Real-time transcription using Deepgram API
- 📋 Copy transcribed text to clipboard
- 🖥️ Cross-platform support (Windows, macOS, Linux)
- 🎨 Clean and intuitive user interface
- 🔒 Secure API key storage

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### System-Specific Requirements

**macOS:**

```bash
xcode-select --install
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libasound2-dev
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd wispr-flow-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Deepgram API Key

You have two options:

**Option A: Using Environment Variable (Development)**

```bash
cp .env.example .env
# Edit .env and add your Deepgram API key
```

**Option B: Using In-App Settings (Recommended)**

- Run the app
- Click the settings icon (⚙️)
- Enter your Deepgram API key
- Click "Save API Key"

Get your API key from [Deepgram Console](https://console.deepgram.com/)

### 4. Run Development Server

```bash
npm run tauri dev
```

## Building for Production

### Build for Current Platform

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`

### Platform-Specific Builds

**Windows:**

- Executable: `.exe`
- Installer: `.msi`

**macOS:**

- App Bundle: `.app`
- DMG: `.dmg`

**Linux:**

- AppImage: `.AppImage`
- Debian Package: `.deb`

## Usage

1. **Configure API Key**: Click the settings icon and enter your Deepgram API key
2. **Grant Microphone Permission**: Allow microphone access when prompted
3. **Start Recording**: Press and hold the microphone button
4. **Speak**: Talk clearly into your microphone
5. **Stop Recording**: Release the button
6. **Copy Text**: Use the "Copy" button to copy transcribed text

## Project Structure

```
wispr-flow-clone/
├── src/
│   ├── components/         # React components
│   │   ├── RecordButton.tsx
│   │   ├── TranscriptDisplay.tsx
│   │   └── StatusIndicator.tsx
│   ├── services/          # Core services
│   │   ├── audioService.ts
│   │   └── deepgramService.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── config/            # Configuration files
│   │   └── deepgram.ts
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── src-tauri/             # Tauri backend
│   ├── src/
│   │   └── main.rs        # Rust backend
│   ├── tauri.conf.json    # Tauri configuration
│   └── Cargo.toml         # Rust dependencies
└── package.json           # Node dependencies
```

## Architecture

### Audio Capture Flow

1. Request microphone permission
2. Create MediaStream from user's microphone
3. Use MediaRecorder to capture audio chunks
4. Send audio chunks to Deepgram WebSocket

### Transcription Flow

1. Establish WebSocket connection to Deepgram
2. Stream audio data in real-time
3. Receive interim and final transcription results
4. Display transcribed text in the UI

### Key Technologies

- **Tauri**: Cross-platform desktop framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Deepgram API**: Real-time speech-to-text
- **Web Audio API**: Audio capture and processing

## Development Priorities

This project focuses on:

1. ✅ Functionality and user workflow
2. ✅ Clean, maintainable code architecture
3. ✅ Proper separation of concerns
4. ✅ Reliable audio capture and streaming
5. ✅ Fast, accurate transcription integration

## Known Limitations

- Requires active internet connection for transcription
- Deepgram API usage may incur costs based on usage
- Audio quality depends on microphone hardware
- WebSocket connection may timeout on very long recordings

## Troubleshooting

### Microphone Not Working

- Ensure microphone permissions are granted
- Check system microphone settings
- Try restarting the application

### Deepgram Connection Errors

- Verify API key is correct
- Check internet connection
- Ensure API key has sufficient credits

### Build Errors

- Ensure all prerequisites are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Tauri cache: `rm -rf src-tauri/target`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- [Tauri](https://tauri.app/) - Desktop app framework
- [Deepgram](https://deepgram.com/) - Speech-to-text API
- [Wispr Flow](https://www.wisprflow.com/) - Inspiration for this project

## Support

For issues and questions:

- Open an issue on GitHub
- Check [Tauri Documentation](https://tauri.app/v1/guides/)
- Review [Deepgram Documentation](https://developers.deepgram.com/)
