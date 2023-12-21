const {ipcRenderer} = require('electron');
const path = require('path');
const server = require("./app.js");

const fs = require('fs');

const { BytesToPrinter, getPrintersObj, stringToDisplayPole } = require('./Services/BytesToPrinter.js');
const { fn_label_printing } = require('./Services/LabelPrinters.js');
const { to_Open_Cash_Drawer, to_Open_Cash_Drawer_USING_DLL  } = require('./Services/OpenCashDrawer.js');
const { to_print_pdf_files } = require('./Services/PrintingPDF_Files.js');
const { PDFFilesGenerates } = require('./Services/PDFFilesGenerates.js');

const _help_ = require('./Services/Helper.js');

server.get('/get_printers', async (req, res) => {
  let list_printers = await _help_.getListOfPrinters();
  res.send(list_printers)
})

server.get('/get_Machine_HostNameandMACAddress', async (req, res) => {
  let list_host_mac_addr = _help_.get_Machine_HostNameandMACAddress();
  res.send(list_host_mac_addr)
})

server.get('/display_pole_connections', async (req, res) => {
  // LINE Minimum Length = 15; 
  let D_ports = _help_.get_display_pole_ports() ;
  let display_Obj = {
    port: D_ports ? D_ports : 'COM1',
    line_1: req.query.line_1 ? str_minimum_lentgh(req.query.line_1) : "",
    line_2: req.query.line_2 ? str_minimum_lentgh(req.query.line_2) : "",
  }

  stringToDisplayPole(display_Obj);
  res.send(`Port Obj. : ${JSON.stringify(display_Obj)}`);
});

server.post('/bytes_string_to_print', async (req, res) => {
  let print_obj = {
    "data": req.body.data,
    "id": "POS_BILL_PRINT",
    "printer":  _help_.get_pos_printers()
  };
  BytesToPrinter(print_obj);
  
  res.send('Success')
});


server.post('/html_string_to_print', async (req, res) => {
  let htmlBoleto = req.body.data;

  let print_obj = {
    "htmlContent": req.body.data,
    "printer": _help_.get_pos_printers()
  }
  let dd = await prinTMethods(print_obj).then(resData=> {
     return 'Success';
  }).catch((error) => {
     console.log(error, 'error');
     return 'error';
  })
  res.send(dd);
});

server.post('/html_string_to_print_pos', async (req, res) => {
  let htmlBoleto = req.body.data;

  let print_obj = {
    "htmlContent": req.body.data,
    "printer": _help_.get_pos_printers()
  }
  let dd = await prinTMethods(print_obj).then(resData=> {
     return 'Success';
  }).catch((error) => {
     console.log(error, 'error');
     return 'error';
  })
  res.send(dd);
});

server.post('/html_string_to_print_pdf', async (req, res) => {
  let htmlBoleto = req.body.data;

  let print_obj = {
    "htmlContent": req.body.data,
    "printer": _help_.get_wholesale_printers()
  }
  let dd = await prinTMethods(print_obj).then(resData=> {
     return 'Success';
  }).catch((error) => {
     console.log(error, 'error');
     return 'error';
  })
  res.send(dd);
});
server.post('/html_string_to_print_label', async (req, res) => {
  let htmlBoleto = req.body.data;

  let print_obj = {
    "htmlContent": req.body.data,
    "printer": _help_.get_label_printers()
  }
  let dd = await prinTMethods(print_obj).then(resData=> {
     return 'Success';
  }).catch((error) => {
     console.log(error, 'error');
     return 'error';
  })
  res.send(dd);
});

function prinTMethods(print_obj = {}){
  ipcRenderer.send('print', print_obj)
  return new Promise((resolve, reject) => {
    ipcRenderer.on('res-print',(event, arg) => {
        resolve(arg)
    })
  })
}

function prinTMethods_Base64(print_obj = {}){
  ipcRenderer.send('print_base_64', print_obj)
  return new Promise((resolve, reject) => {
    ipcRenderer.on('res-print_base_64',(event, arg) => {
        resolve(arg)
    })
  })
}

function str_minimum_lentgh(str = ''){
  if (!str) {
    return '';
  }
  return str.length > 19 ? str.substring(0, 17)+".." : str;
}

server.post('/label_printings_zpl', async (req, res) => {
  let print_obj = {
    "data": req.body.data,
    "printer": _help_.get_label_printers()
  };
  fn_label_printing(print_obj);

  res.send('Success')
});


server.get('/to_open_cash_drawer', async (req, res) => {

  let print_obj = {
    "printer": _help_.get_pos_printers()
  };
  to_Open_Cash_Drawer(print_obj);
  res.send('Success')
});


server.get('/to_open_cash_drawer_using_dll', async (req, res) => {
  let print_obj = {
    "printer": _help_.get_pos_printers()
  };
  to_Open_Cash_Drawer_USING_DLL(print_obj);
  res.send('Success')
});



server.post('/to_print_pdf_files', async (req, res) => {
  
  let sys_d = path.resolve(__dirname, "./extraResources/System.Drawing.dll");
  let pdf_v = path.resolve(__dirname, "./extraResources/PdfiumViewer.dll");

  let print_obj = {
    "printer": _help_.get_wholesale_printers(),
    "sys_d": sys_d,
    "pdf_v": pdf_v,
    "file_path": req.body.file_path,
    "copies": Number(req.body.copies) ? Math.floor(Number(req.body.copies)) : 1,
  };

  to_print_pdf_files(print_obj);
  
  res.send('Success')
});


server.post('/base_64_to_pdf_Files', async (req, res) => {
  
  let print_obj = {
    "data": req.body.data,
    "printer": _help_.get_wholesale_printers()
  }
  let dd = await prinTMethods_Base64(print_obj).then(resData=> {
     return 'Success';
  }).catch((error) => {
     console.log(error, 'error');
     return 'error';
  })
  res.send(dd);
});





server.post('/to_pdf_files_generates_and_print', async (req, res) => {
    
  let sys_d = path.resolve(__dirname, "./extraResources/System.Drawing.dll");
  let pdf_v = path.resolve(__dirname, "./extraResources/PdfiumViewer.dll");

  let print_obj = {
    "printer": _help_.get_wholesale_printers(),
    "sys_d": sys_d,
    "pdf_v": pdf_v,
    "INV_HtmlContent": req.body.INV_HtmlContent,
    "INV_LOT_HtmlContent": req.body.INV_LOT_HtmlContent,
    "Data": req.body.Data,
    "copies": Number(req.body.Copies) ? Math.floor(Number(req.body.Copies)) : 1,
  };

  PDFFilesGenerates(print_obj);
  res.send('Success')
});


 server.post('/html_string_to_pdf_generate_and_print', async (req, res) => {
  const CD = new Date();
  const tempNAME= CD.getDate()+'_'+CD.getMonth()+'_'+CD.getFullYear()+'_'+CD.getHours()+'_'+CD.getMinutes()+'_'+CD.getMinutes();
  let OutPutPath = path.resolve(__dirname, ".") + "/PDF_FILES/Direct_TEMP_PDF__"+tempNAME+'_'+_help_.generateRandomString()+".pdf";

  let print_obj = {
    "htmlContent": req.body.data,
    "OutPutPath": OutPutPath,
    "displayHeaderFooter": req.body.displayHeaderFooter ? true : false,
    "headerTemplate": (req.body.displayHeaderFooter ? (req.body.headerTemplate ? req.body.headerTemplate+'' : ` `) : ` `),
    "footerTemplate": (req.body.displayHeaderFooter ? (req.body.footerTemplate ? req.body.footerTemplate+'' : ` `) : ` `),
  }

  let dd = await _help_.CommonPrinTPDFMethods(print_obj).then(resData=> {
      if(resData.status){
        let sys_d = path.resolve(__dirname, "./extraResources/System.Drawing.dll");
        let pdf_v = path.resolve(__dirname, "./extraResources/PdfiumViewer.dll");

        let print_obj = {
          "printer": _help_.get_wholesale_printers(),
          "sys_d": sys_d,
          "pdf_v": pdf_v,
          "file_path": resData.pdfPath,
          "copies": 1,
        };
        to_print_pdf_files(print_obj);
        return 'error';
      }else{
        return 'Success';
      }
  }).catch((error) => {
     return 'error';
  })
  res.send(dd);
});