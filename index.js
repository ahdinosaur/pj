const electron = require('electron')

const { app, BrowserWindow, ipcMain } = require('electron')

const Path = require('path')
const Url = require('url')

var mainWindow

app.on('ready', createLeader)
app.on('activate', function () {
  if (mainWindow === null) {
    createLeader()
  }
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('create-follower', createFollower)

function createLeader () {
  createWindow('./leader')
}

function createFollower () {
  createWindow('./follower')
}

function createWindow (path) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL(Url.format({
    pathname: Path.join(__dirname, 'index.html'),
    hash: `#${path}`,
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
