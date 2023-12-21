const edge = require('electron-edge-js');
const path = require('path');
const fs = require('fs');

function to_print_pdf_files(print_obj = {}){
  var Print_PDF_FILES = edge.func({
   source: function() {/*
     using System;
     using System.Threading.Tasks;
     using System.Text;
     using System.Drawing.Printing;
     using PdfiumViewer;

      public class Startup
      {    
        public async Task<object> Invoke(dynamic print_Obj)
        {  
           try {
              string file_path = print_Obj.file_path;
                  
              var printerSettings = new PrinterSettings {
                PrinterName = print_Obj.printer,
                Copies = (short)print_Obj.copies,
              };
              var pageSettings = new PageSettings(printerSettings) {
                  Margins = new Margins(0, 0, 0, 0),
              };
              foreach (PaperSize paperSize in printerSettings.PaperSizes) {
                  if (paperSize.PaperName == "A4") {
                      pageSettings.PaperSize = paperSize;
                      break;
                  }
              }
              using (var document = PdfDocument.Load(file_path)) {
                using (var printDocument = document.CreatePrintDocument()) {
                  printDocument.PrinterSettings = printerSettings;
                  printDocument.DefaultPageSettings = pageSettings;
                  printDocument.PrintController = new StandardPrintController();
                  printDocument.Print();
                }
              }
              return "Success";
           }catch (Exception e){
              return "Error: " + e.Message + "\n " + e.StackTrace;
           }
          
        }
      }
    */},
    references: [ print_obj.sys_d, print_obj.pdf_v ]
  });
  
  Print_PDF_FILES(print_obj, function (error, result) {
      fs.unlink(print_obj.file_path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('File deleted successfully');
      });
      if (error) {
       console.log(error, 'error')
       throw error;
      }else{
       console.log(result, 'result')
      }
  });
}

module.exports = {
	to_print_pdf_files, 
}