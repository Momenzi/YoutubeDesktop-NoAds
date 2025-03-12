/*!
 * YoutubeDesktop-NoAds - Electron App 🚀
 * (c) 2025 Momenzi
 * Author: Momenzi
 * GitHub: https://github.com/Momenzi/YoutubeDesktop-NoAds
 * License: MIT
 *
 * Description: A YouTube Electron-based app that blocks ads and enhances user experience
 * with premium features such as SponsorBlock, PiP mode, Audio Booster, and more.
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        }
    });

    mainWindow.loadURL('https://www.youtube.com');

    mainWindow.webContents.once('dom-ready', () => {
        console.log("🔄 Loading extensions...");
        loadExtensions();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function loadExtensions() {
    const EXTENSIONS_FOLDER = path.join(__dirname, 'extensions');

    if (!fs.existsSync(EXTENSIONS_FOLDER)) {
        console.error('Extensions folder not found!');
        return;
    }

    fs.readdirSync(EXTENSIONS_FOLDER).forEach(file => {
        if (file.endsWith('.js')) {
            const scriptPath = path.join(EXTENSIONS_FOLDER, file);
            console.log(`Loading extension: ${file}`);

            fs.readFile(scriptPath, 'utf8', (err, script) => {
                if (err) {
                    console.error(`Error reading ${file}:`, err);
                    return;
                }

                mainWindow.webContents.executeJavaScript(script)
                    .then(() => console.log(`Successfully loaded: ${file}`))
                    .catch(err => console.error(`Error executing ${file}:`, err));
            });
        }
    });
}
