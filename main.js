const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const fs = require('fs');

let mainWindow;
 
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
 
  mainWindow.loadFile('index.html')
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
 
app.on("ready", createWindow);
 
app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});
 
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
 
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('getDetaultPrinter', (event)=> {
  event.sender.send('res-getDetaultPrinter', getDefaultPrinter(mainWindow.webContents.getPrinters()))
})


ipcMain.on('getAllPrinter', (event)=> {
  event.sender.send('res-AllPrinter', mainWindow.webContents.getPrinters())
})

function getDefaultPrinter(arrPrinters){
  for (let printer of arrPrinters) {
    if (printer.isDefault) {
      return printer
    }
  }
}



ipcMain.on('print_base_64', (event, print_obj)=> {
  let counterPrints = 0
  let printingInfoArr = []
  
  let printerWindow = new BrowserWindow({width: 800, height: 600, show: false });
  printerWindow.loadURL(print_obj.data)

  printerWindow.webContents.on('did-finish-load', () => {
    let options = {
      silent: true,
      deviceName: print_obj.printer
    }
    printerWindow.webContents.print(options, (status, errorType) => {
      if (!status) console.log(errorType, 'errorType');
      counterPrints++
      printingInfoArr.push({
        statusOfPrint: status,
        numOfPrint: counterPrints,
        error_MSG: errorType
      })
      
      event.sender.send('res-print_base_64', printingInfoArr)

      printerWindow.close()
    })
  })

})


ipcMain.on('print', (event, print_obj)=> {
  let counterPrints = 0
  let printingInfoArr = []
  
  let printerWindow = new BrowserWindow({width: 800, height: 600, show: false });
  printerWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(print_obj.htmlContent))

  printerWindow.webContents.on('did-finish-load', () => {
    let options = {
      silent: true,
      deviceName: print_obj.printer
    }
    printerWindow.webContents.print(options, (status, errorType) => {
      if (!status) console.log(errorType, 'errorType');
      counterPrints++
      printingInfoArr.push({
        statusOfPrint: status,
        numOfPrint: counterPrints,
        error_MSG: errorType
      })
      
      event.sender.send('res-print', printingInfoArr)

      printerWindow.close()
    })
  })

})



ipcMain.on('GeneratePDF_FILE', (event, print_obj, unique_string)=> {
  const win = new BrowserWindow({width: 800, height: 600, show: false })
    
  win.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(print_obj.htmlContent))
  win.webContents.on('did-finish-load', () => {
    const Options  = {
      displayHeaderFooter: print_obj.displayHeaderFooter ? true : false,
      headerTemplate: (print_obj.displayHeaderFooter ? (print_obj.headerTemplate ? print_obj.headerTemplate+'' : ` `) : ` `),
      footerTemplate: (print_obj.displayHeaderFooter ? (print_obj.footerTemplate ? print_obj.footerTemplate+'' : ` `) : ` `),
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
      format: 'A4',
    }
    const pdfPath = print_obj.OutPutPath;    
    win.webContents.printToPDF(Options).then(data => {
      fs.writeFile(pdfPath, data, (error) => {
        if (error){
          event.sender.send(`res-GeneratePDF_FILE_${unique_string}`, {
            error_MSG: error,
            status: false,
            pdfPath: pdfPath,
          })
        }else{
          event.sender.send(`res-GeneratePDF_FILE_${unique_string}`, {
            error_MSG: '',
            status: true,
            pdfPath: pdfPath,
          })
        }
      })
    }).catch(error => {
        event.sender.send(`res-GeneratePDF_FILE_${unique_string}`, {
          error_MSG: error,
          status: false,
          pdfPath: pdfPath,
        })
    })
  })
})

