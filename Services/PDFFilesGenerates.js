const Mustache = require('mustache');
const path = require('path');
const fs = require('fs');

const { to_print_pdf_files } = require('./PrintingPDF_Files.js');
const _help_ = require('./Helper.js');

function PDFFilesGenerates(print_obj = {}) {
  const CD = new Date();
  const tempNAME= CD.getDate()+'_'+CD.getMonth()+'_'+CD.getFullYear()+'_'+CD.getHours()+'_'+CD.getMinutes()+'_'+CD.getMinutes();
  let OutPutPath = path.resolve(__dirname, "..\\") + "\\PDF_FILES\\SALES_INV_"+tempNAME+'_'+_help_.generateRandomString()+".pdf";

	exportHTMLAsPdf(print_obj, OutPutPath).then((response) => {
    let FinalPath = OutPutPath;
    let PASSING_obj = {
      "printer": print_obj.printer,
      "sys_d": print_obj.sys_d,
      "pdf_v": print_obj.pdf_v,
      "file_path": FinalPath,
      "copies": Number(print_obj.copies) ? Math.floor(Number(print_obj.copies)) : 1,
    };
    to_print_pdf_files(PASSING_obj);

	}).catch((error) => {
	  console.error('Error creating PDF:', error);
	});
  PROCESSING_LOT_PDF_GENERATE(print_obj);
}

async function exportHTMLAsPdf(print_obj = {}, OutPutPath) {
	const filledTemplate = Mustache.render(print_obj.INV_HtmlContent, print_obj.Data);

  const PASSING_obj = {
    "htmlContent": filledTemplate,
    "OutPutPath": OutPutPath,
    "displayHeaderFooter": true,
    "headerTemplate": ` `,
    "footerTemplate": `<footer style="width: 100%; padding-left: 50px !important;">
      <span>
        <span style="font-size: 12px; font-weight: bold;">IMPORTANT NOTICE</span><br>
        <span style="font-size: 10px; font-weight: bold;">1) PLEASE ENSURE YOU COLLECT YOUR GOODS BEFORE 3PM ON THE SAME DAY</h5><br>
        <span style="font-size: 10px; font-weight: bold;">2) CHEQUES SHOULD BE DRAWN IN FAVOUR OF SEYCHELLES TRADING COMPANY</span>
      </span>
    </footer>`,
  }

  let dd = await _help_.CommonPrinTPDFMethods(PASSING_obj).then(resData=> {
     return resData;
  }).catch((error) => {
     return {
      error_MSG: error,
      status: false,
      pdfPath: OutPutPath,
     };
  })
  console.log(dd,'SALES_INV_')
  return dd;
}

function PROCESSING_LOT_PDF_GENERATE(print_obj = {}){
  let SITE_DATA = print_obj.Data.SITE_DISTINTCT_DATA;

  for (var i = 0; i < SITE_DATA.length; i++) {
   lot_PDF_GENERATE_AND_PRINT(SITE_DATA[i], print_obj)
  }

}

function lot_PDF_GENERATE_AND_PRINT(SITE_DATA = {}, print_obj = {}){
  const CD = new Date();
  const tempNAME= CD.getDate()+'_'+CD.getMonth()+'_'+CD.getFullYear()+'_'+CD.getHours()+'_'+CD.getMinutes()+'_'+CD.getMinutes();
  let OutPutPath = path.resolve(__dirname, "..\\") + "\\PDF_FILES\\SALES_LOT_INV_"+tempNAME+'_'+_help_.generateRandomString()+".pdf";

  exportLOTHTMLAsPdf(SITE_DATA, print_obj, OutPutPath).then((response) => {
    
    let FinalPath = OutPutPath;
    let PASSING_obj = {
      "printer": SITE_DATA.LOT_PRINTER_NAME,
      "sys_d": print_obj.sys_d,
      "pdf_v": print_obj.pdf_v,
      "file_path": FinalPath,
      "copies": Number(print_obj.copies) ? Math.floor(Number(print_obj.copies)) : 1,
    };
    to_print_pdf_files(PASSING_obj);
  }).catch((error) => {
    console.error('Error creating PDF:', error);
  });

}

async function exportLOTHTMLAsPdf(SITE_DATA = {}, print_obj = {}, OutPutPath) {
  const filledTemplate = Mustache.render(print_obj.INV_LOT_HtmlContent, SITE_DATA);
  
  const PASSING_obj = {
    "htmlContent": filledTemplate,
    "OutPutPath": OutPutPath,
    "displayHeaderFooter": true,
    "headerTemplate": ` `,
    "footerTemplate": `<div id="footer-template" style="display: flex; font-size:8px !important; color:#808080; padding-left: 50px; text-align: center">
      Invoice No.&nbsp;: &nbsp; ${SITE_DATA.Invoice_No}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      Page &nbsp;<span class="pageNumber"></span>&nbsp;of&nbsp;<span class="totalPages"></span>
    </div>`,
  }

  let dd = await _help_.CommonPrinTPDFMethods(PASSING_obj).then(resData=> {
     return resData;
  }).catch((error) => {
     return {
      error_MSG: error,
      status: false,
      pdfPath: OutPutPath,
     };
  })
  // console.log(dd,'SALES_INV_LOT_')
  return dd;
}

module.exports = {
	PDFFilesGenerates, 
}