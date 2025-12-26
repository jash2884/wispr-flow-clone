# Deployment Guide

## Building for Distribution

### Prerequisites

- Ensure all development dependencies are installed
- Test the application thoroughly in development mode
- Have valid code signing certificates (for production releases)

### Build Commands

#### Development Build (Debug)

```bash
npm run tauri build -- --debug
```

#### Production Build (Release)

```bash
npm run tauri build
```

### Platform-Specific Instructions

## Windows Deployment

### Building on Windows

1. **Install Windows Build Tools**

```powershell
   # Install Visual Studio Build Tools
   # Download from: https://visualstudio.microsoft.com/downloads/
```

2. **Build the Application**

```bash
   npm run tauri build
```

3. **Output Locations**
   - MSI Installer: `src-tauri/target/release/bundle/msi/`
   - NSIS Installer: `src-tauri/target/release/bundle/nsis/`
   - Executable: `src-tauri/target/release/wispr-flow-clone.exe`

### Code Signing (Optional but Recommended)

Add to `tauri.conf.json`:

```json
{
  "tauri": {
    "bundle": {
      "windows": {
        "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT",
        "digestAlgorithm": "sha256",
        "timestampUrl": "http://timestamp.digicert.com"
      }
    }
  }
}
```

## macOS Deployment

### Building on macOS

1. **Install Xcode Command Line Tools**

```bash
   xcode-select --install
```

2. **Build the Application**

```bash
   npm run tauri build
```

3. **Output Locations**
   - App Bundle: `src-tauri/target/release/bundle/macos/`
   - DMG: `src-tauri/target/release/bundle/dmg/`

### Code Signing & Notarization

1. **Get a Developer ID Certificate**

   - Sign up for Apple Developer Program ($99/year)
   - Create certificates in Xcode

2. **Configure Signing**
   Add to `tauri.conf.json`:

```json
{
  "tauri": {
    "bundle": {
      "macOS": {
        "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
        "entitlements": "entitlements.plist"
      }
    }
  }
}
```

3. **Notarize the App**

```bash
   # After building
   xcrun notarytool submit \
     src-tauri/target/release/bundle/dmg/YourApp.dmg \
     --apple-id your@email.com \
     --team-id TEAM_ID \
     --password app-specific-password
```

## Linux Deployment

### Building on Linux

1. **Install Dependencies** (Ubuntu/Debian)

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

2. **Build the Application**

```bash
   npm run tauri build
```

3. **Output Locations**
   - AppImage: `src-tauri/target/release/bundle/appimage/`
   - Deb Package: `src-tauri/target/release/bundle/deb/`

### Distribution

- **AppImage**: Universal format, works on most distros
- **Deb**: For Debian/Ubuntu-based systems
- **RPM**: Can be built with additional configuration

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install dependencies (Ubuntu)
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.0-dev \
            build-essential \
            curl \
            wget \
            file \
            libssl-dev \
            libgtk-3-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev \
            libasound2-dev

      - name: Install npm dependencies
        run: npm install

      - name: Build
        run: npm run tauri build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: src-tauri/target/release/bundle/
```

## Distribution Channels

### 1. GitHub Releases

- Create releases with built artifacts
- Users can download directly

### 2. App Stores (Advanced)

**Windows:**

- Microsoft Store submission
- Requires app signing

**macOS:**

- Mac App Store submission
- Requires Apple Developer account

**Linux:**

- Flathub
- Snapcraft Store

### 3. Direct Download

- Host on your website
- Use CDN for distribution

## Auto-Update Setup (Optional)

1. **Install Tauri Updater**

```bash
   npm install @tauri-apps/plugin-updater
```

2. **Configure in tauri.conf.json**

```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://your-server.com/releases/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

3. **Generate Update Files**
   - Create JSON manifest with version info
   - Host signed update files

## Security Checklist

- [ ] API keys are not hardcoded
- [ ] Application is code signed
- [ ] HTTPS is used for all API calls
- [ ] User data is stored securely
- [ ] Permissions are properly requested
- [ ] Updates are signed and verified
- [ ] Dependencies are up to date

## Performance Optimization

1. **Reduce Bundle Size**

```json
// tauri.conf.json
{
  "tauri": {
    "bundle": {
      "resources": [] // Only include necessary resources
    }
  }
}
```

2. **Optimize Assets**

   - Compress images
   - Minify JavaScript
   - Tree-shake unused code

3. **Production Build**

```bash
   NODE_ENV=production npm run tauri build
```

## Testing Before Release

1. **Smoke Testing**

   - Test on clean system
   - Verify all features work
   - Check error handling

2. **Cross-Platform Testing**

   - Test on target platforms
   - Verify UI rendering
   - Check platform-specific features

3. **Performance Testing**
   - Monitor memory usage
   - Check
