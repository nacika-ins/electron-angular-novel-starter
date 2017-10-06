const electron = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const ipcMain = require( 'electron' ).ipcMain;
const glob = require('glob');
const key = 'X6v+[4>F81%AT_me';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 暗号化されたファイルの読み込み
 */
var LoadFileService = function LoadFileService() {};
LoadFileService.prototype.getFiles = () => {
  return new Promise((resolve) => {

    var keyBuf = new Buffer('2ePSoP0&Dt+&!ZRLq?bLGz}KC3$*ar6n');
    var ret = {};
    let count = 0;
    const appPath = app.getAppPath();

    glob( appPath + '/assets/**/*.*', {}, function (er, files) {
      files.forEach( (filePath) => {
        var inputStream = fs.createReadStream(filePath);
        var newBuffer;
        var cipher = crypto.createDecipher('aes256', keyBuf);

        inputStream.on('data', function(data) {
          var buf = new Buffer(cipher.update(data), 'binary');
          if (!newBuffer) {
            newBuffer = buf;
          } else {
            newBuffer = Buffer.concat([newBuffer, buf], newBuffer.length + buf.length);
          }
        });

        inputStream.on('end', function() {
          try {
            var buf = new Buffer(cipher.final('binary'), 'binary');
            newBuffer = Buffer.concat([newBuffer, buf], newBuffer.length + buf.length);

            // save
            const ext = path.extname(filePath);
            const key = filePath.replace(appPath + '/assets/', '');
            if (ext == ".png" || ext == ".gif") {
              ret[key] = 'data:image/'+ ext.replace(/^\./, "") +';base64,' + newBuffer.toString('base64');
            } else if ( ext == ".jpg" || ext == ".jpeg" || ext == ".JPG" || ext == ".JPEG" ) {
              ret[key] = 'data:image/jpeg;base64,' + newBuffer.toString('base64');
            } else if ( ext == ".wav" || ext == ".mp3") {
              ret[key] = 'data:audio/'+ ext.replace(/^\./, "") +';base64,' + newBuffer.toString('base64');
            }else {
              ret[key] = newBuffer.toString('base64');
            }

          } catch(e) {
          }
          count += 1;

          if ( count == files.length ) {
            console.log('complete');
            resolve(ret);
          }
        });
      });
    });
  });
};

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

/**
 * 新規ウィンドウの作成
 */
function createWindow () {

  // TODO: dev tool
  const isOpenDevTool = false;
  if (isOpenDevTool) {
    mainWindow = new BrowserWindow({width: 1500, height: 600, useContentSize: true, resizable: false});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow = new BrowserWindow({
      title: "タイトル",
      width: 800,
      height: 600,
      useContentSize: true,
      resizable: false
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/index.html`);
  }

  // 起動監視
  // Angularの起動が行われた時に呼ばれる
  ipcMain.on("ready", () => {
    console.log("ready");

    // ファイルの読み込み
    const loadFileService = new LoadFileService();
    loadFileService.getFiles().then( (files) => {
      console.log("send file");
      mainWindow.webContents.send('fileData', files);
    });

  });

  // ウィンドウが閉じたときに呼ばれる
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// applicationの準備が完了した場合にウィンドウを作成する
app.on('ready', createWindow);

// ウィンドウが全て閉じられた場合applicationを終了する
// OSXではウィンドウを閉じても終了しない
app.on('window-all-closed', function () {
  app.quit();
})

// アクチベート中にウィンドウがない場合、再作成する
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});
