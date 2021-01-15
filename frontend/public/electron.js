const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
// import { initSplashScreen, OfficeTemplate } from 'electron-splashscreen';
const { initSplashScreen, OfficeTemplate } = require('electron-splashscreen')

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
        // width: 1200,
        // height: 600,
        webPreferences:{
            nodeIntegration: true,
            webSecurity: false
        },
        // frame: false,
        show:false
    });
    mainWindow.maximize();
    mainWindow.setMenuBarVisibility(false)
    // mainWindow.webContents.openDevTools();
    // mainWindow.loadURL('http://13.59.158.131:3000/')
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    
    mainWindow.on('ready-to-show', () => {

      mainWindow.show();

  })

  const hideSplashscreen = initSplashScreen({
    mainWindow,
    icon: path.join(__dirname, '../build/apple-icon.png'),
    url: OfficeTemplate,
    width: 500,
    height: 300,
    brand: 'Fittzee',
    productName: 'FittZee',
    logo: path.join(__dirname, '../build/apple-icon.png'),
    website: 'www.fittzee.com',
    text: 'Initializing ...'
  });

  mainWindow.once('ready-to-show', () => {
    hideSplashscreen();
    mainWindow.show();
  });

  mainWindow.on('closed', () => mainWindow = null);
  
}




app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

