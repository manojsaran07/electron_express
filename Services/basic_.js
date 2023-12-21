
const puppeteer = require('puppeteer');
const Mustache = require('mustache');
const { to_print_pdf_files } = require('./Services/PrintingPDF_Files.js');

 //Get HTML content from HTML file
const html = fs.readFileSync(path.resolve(__dirname, "./testing_page.html"), 'utf-8');
let OutPutPath = path.resolve(__dirname, "./result.PDF")
exportWebsiteAsPdf(html, OutPutPath).then(() => {
  console.log('PDF created successfully.');
  console.log(OutPutPath,'OutPutPath')
  // let sys_d = path.resolve(__dirname, "./extraResources/System.Drawing.dll");
  //   let pdf_v = path.resolve(__dirname, "./extraResources/PdfiumViewer.dll");
  //  let PASSING_obj = {
  //     "printer": "BIXOLON SRP-350plusIII",
  //     "sys_d": sys_d,
  //     "pdf_v": pdf_v,
  //     "file_path": OutPutPath,
  //     "copies": 1,
  //   };
  //   to_print_pdf_files(PASSING_obj);
}).catch((error) => {
  console.error('Error creating PDF:', error);
});




async function exportWebsiteAsPdf(html, outputPath) {

  const browser = await puppeteer.launch({
    executablePath: path.join(__dirname, '.cache', '/puppeteer/chrome/win64-116.0.5845.96/chrome-win64/chrome.exe'),
    headless: 'new'
  });

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  let TemPHeight = await page.evaluate(() => document.getElementById('myDiv').offsetHeight );
  console.log(TemPHeight,'TemPHeight')
  let pageHeight = 0; 
  console.log(pageHeight,'pageHeight')
  if (TemPHeight) pageHeight += TemPHeight;
  console.log(pageHeight,'pageHeight')
  270 <= pageHeight ? pageHeight = pageHeight : pageHeight = 270;
  console.log(pageHeight,'pageHeight')

  // Download the PDF
  const PDF = await page.pdf({
    path: outputPath,
    margin: { top: '20px', right: '20px', bottom: '0px', left: '20px' },
    printBackground: true,
    // format: 'A4',
    width: "270px",
    height: pageHeight+"px",
  });

  // Close the browser instance
  await browser.close();

  return PDF;
}

// 


const puppeteer = require('puppeteer');
const Mustache = require('mustache');
const { to_print_pdf_files } = require('./Services/PrintingPDF_Files.js');

 //Get HTML content from HTML file
const html = fs.readFileSync('testing_page.html', 'utf-8');
exportWebsiteAsPdf(html, 'result.PDF').then(() => {
  console.log('PDF created successfully.');
  let OutPutPath = path.resolve(__dirname, "./result.PDF")
  console.log(OutPutPath,'OutPutPath')
  let sys_d = path.resolve(__dirname, "./extraResources/System.Drawing.dll");
    let pdf_v = path.resolve(__dirname, "./extraResources/PdfiumViewer.dll");
   let PASSING_obj = {
      "printer": "BIXOLON SRP-350plusIII",
      "sys_d": sys_d,
      "pdf_v": pdf_v,
      "file_path": OutPutPath,
      "copies": 1,
    };
    to_print_pdf_files(PASSING_obj);
}).catch((error) => {
  console.error('Error creating PDF:', error);
});




async function exportWebsiteAsPdf(html, outputPath) {


  const browser = await puppeteer.launch({
    headless: 'new'
  });

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  let pageHeight = await page.evaluate(() => document.getElementById('myDiv').offsetHeight );
  console.log(pageHeight, 'pageHeight');
  // Download the PDF
  const PDF = await page.pdf({
    path: outputPath,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    printBackground: true,
    // format: 'A4',
    width: "270px",
    // height: (pageHeight + 50) + 'px',
  });

  // Close the browser instance
  await browser.close();

  return PDF;
}


// 

const puppeteer = require('puppeteer');
const Mustache = require('mustache');


 //Get HTML content from HTML file
const html = fs.readFileSync('sales_inv_pdf.html', 'utf-8');
exportWebsiteAsPdf(html, 'result.PDF').then(() => {
  console.log('PDF created successfully.');
}).catch((error) => {
  console.error('Error creating PDF:', error);
});




async function exportWebsiteAsPdf(html, outputPath) {
  // Create a browser instance

  const img_path = fs.readFileSync(path.resolve(__dirname, "./assets/stc_logo.jpg"));
  const qr_path = fs.readFileSync('./qr-code.svg');
  const dummy_DATA = fs.readFileSync(path.resolve(__dirname, "./dummy_sales_item.json"));
  const SalesItemData = JSON.parse(dummy_DATA);

  const pageSize = 17;
  const pageCount = Math.ceil( SalesItemData["data"].length / pageSize);
  let SalesPageITEMDATA = [];

  let cm_footer = "11cm"
  let last_page_length = 0;
  for (var i = 0; i < pageCount; i++) {
    const start = i * pageSize;
    const end = Math.min(start + pageSize, SalesItemData["data"].length);
    const pageItems = SalesItemData["data"].slice(start, end);
    SalesPageITEMDATA.push({
      index: i,
      page: i+1,
      page_break_cls: "page_break_Before",
      page_Data: pageItems,
      is_display: "",
    })
    last_page_length = pageItems.length;
  }

  if(last_page_length == 0) cm_footer = "9cm";
  if(last_page_length == 1) cm_footer = "7cm";
  if(last_page_length == 2) cm_footer = "6.5cm";
  if(last_page_length == 3) cm_footer = "6cm";
  if(last_page_length == 4) cm_footer = "5.5cm";
  if(last_page_length == 5) cm_footer = "5cm";
  if(last_page_length == 6) cm_footer = "4.5cm";
  if(last_page_length == 7) cm_footer = "4cm";
  if(last_page_length == 8) cm_footer = "3.5cm";
  if(last_page_length == 9) cm_footer = "3cm";
  if(last_page_length == 10) cm_footer = "2.5cm";

  if (cm_footer == '11cm') {
    let temp_Ikey = SalesPageITEMDATA.length;
    SalesPageITEMDATA.push({
      index: temp_Ikey - 1,
      page: temp_Ikey,
      page_break_cls: "page_break_Before",
      page_Data: [],
      is_display: "hidden"
    })
  }
  let data = {
    // Section 1 Start
    logo_path: "data:image/png;base64,"+ Buffer.from(img_path).toString('base64'), // Only BASE64 IMAGE
    Header_line_1: "Load Test", 
    Header_line_2: "Whole Sales Address",
    qr_path: "data:image/svg+xml;base64,"+ Buffer.from(qr_path).toString('base64'), // Only BASE64 IMAGE
    // Section 1 End

    // Section 2.1 Start
    Address_line_1: "16 rue du Clair Bocage,",
    Address_line_2: "La Valette-du-var,",
    Address_line_3: "Provence-Alpes-Côte d'Azur,",
    Address_line_4: "+01 8348782833,",
    Address_line_5: "973434,",
    Address_line_6: "France.",
    // Section 2.1 End

    // Section 2.2 Start
    Invoice_No: "SI/00023",
    Invoice_Date: "30, Aug 2023",
    Invoice_Time: "09:23 AM",
    Ph_No: "+29334345",
    Customer_A_C_No: "-",
    Site_Name: "Load Test",
    // Section 2.2 End

    // Section 3 Start
    ITEM_DATA: SalesPageITEMDATA,
    // Section 3 End

    // Section 4 Start
    CM_Footer: cm_footer,
    CashAmt: "SCR 7,000.00",
    ChequeAmt: "USD 18.283",
    CreditAmt: "USD 1,000.00",
    PreparedBy: "UserName",
    CustomerBy: "CustomerName",
    Remarks: "Remarks",

    TotalAmt: "144,107.300",
    DiscountAmt: "0.000",
    GoodsValueAmt: "144,107.300",
    VATAmt: "833.55",
    NetPayableAmt: "156,526.100",
    // Section 4 End
  }
  const filledTemplate = Mustache.render(html, data);


  const browser = await puppeteer.launch({
    headless: 'new'
  });

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(filledTemplate, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  // Download the PDF
  const PDF = await page.pdf({
    path: outputPath,
    displayHeaderFooter: true,
    headerTemplate: ` `,
    footerTemplate: `<footer style="width: 100%; padding-left: 50px !important;">
    <span>
      <span style=" font-size: 12px; font-weight: bold;">IMPORTANT NOTICE</span><br>
      <span style=" font-size: 10px; font-weight: bold;">1) PLEASE ENSURE YOU COLLECT YOUR GOODS BEFORE 3PM ON THE SAME DAY</h5><br>
      <span style=" font-size: 10px; font-weight: bold;">2) CHEQUES SHOULD BE DRAWN IN FAVOUR OF SEYCHELLES TRADING COMPANY</span>
    </span>
  </footer>`,
    margin: { top: '50px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  // Close the browser instance
  await browser.close();

  return PDF;
}




















// var displayPOlE = edge.func(function () {/*
// 	using System;
// 	using System.Threading.Tasks;
// 	using System.IO.Ports;

//   public class Startup
//   {		
//     public async Task<object> Invoke(dynamic input)
//     {		
// 				string comPortName = "COM2"; // Replace with the correct COM port name
// 				int baudRate = 9600; // Replace with the correct baud rate
// 				Parity parity = Parity.None; // Replace with the correct parity
// 				int dataBits = 8; // Replace with the correct data bits
// 				StopBits stopBits = StopBits.One; // Replace with the correct stop bits

// 				using (SerialPort serialPort = new SerialPort(comPortName, baudRate, parity, dataBits, stopBits)){
//           try{
//           	serialPort.Open();
//           	// Send commands to the display
//           	SendCommandToDisplay(serialPort, "Hello, Customer!");
//           	// Close the serial port
//           	serialPort.Close();
//           }
//           catch (Exception ex)
//           {
//           	Console.WriteLine("Error: " + ex.Message);
//           }
//         }
//        return "defaultPrinter";
//     }
//     static void SendCommandToDisplay(SerialPort port, string command){
//       port.WriteLine(command);
//     }
//   }
// */});

// displayPOlE(null, function (error, result) {
//     if (error) {
//     	throw error;
//     }else{
//     	console.log(result, 'result')
//     }
// });


// LABEL - 1
// var zplData = @"
//             CT~~CD,~CC^~CT~
//             ^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
//             ^XA
//             ^MMT
//             ^PW280
//             ^LL0240
//             ^LS0
//             ^FT0,37^A0N,23,24^FH\^FDBEANS LOCAL P/KGS^FS
//             ^FT0,64^A0N,20,19^FH\^FDSecond Text^FS
//             ^BY2,3,119^FT0,198^BCN,,Y,N,N,A
//             ^FD12345678FA^FS
//             ^PQ1,0,1,Y^XZ
//           ";

// ^XA
// ^FO50,60^A0,40^FDWorld's Best Griddle^FS
// ^FO 20,20
// ^BCN,100,Y,N,N,A
// ^FD
// 1200175210748180923
// ^FS
// ^XZ

	var toOpenCashDrawer = edge.func(function () {/*
		#r "System.Drawing.dll"

		using System;
		using System.Drawing;	  
		using System.Drawing.Printing;	  
		using System.Threading.Tasks;
		using System.Runtime.InteropServices;
		
	  public class Startup
	  {		

	  	[DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = false, CallingConvention = CallingConvention.StdCall)]
	    public static extern long OpenPrinter(string pPrinterName, out IntPtr phPrinter, long pDefault);

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = false, CallingConvention = CallingConvention.StdCall)]
	    public static extern long StartDocPrinter(IntPtr hPrinter, long Level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOA pDocInfo);

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
	    public static extern long EndDocPrinter(IntPtr hPrinter);

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
	    public static extern long StartPagePrinter(IntPtr hPrinter);

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
	    public static extern long EndPagePrinter(IntPtr hPrinter);

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
	    public static extern long WritePrinter(IntPtr hPrinter, IntPtr pBytes, long dwCount, out long dwWritten);

	    public static bool OpenCashDrawer(string printerName)
	    {
	        const string commandToOpenCashDrawer = "\x1B\x70\x00\x19\xFA"; 

	        IntPtr hPrinter;
	        DOCINFOA di = new DOCINFOA();
	        bool success = false;

	        di.pDocName = "CashDrawerOpen";
	        di.pDataType = "RAW";
					if (OpenPrinter(printerName.Normalize(), out hPrinter, 0) != 0)
	        {
						 if (StartDocPrinter(hPrinter, 1, di) != 0)
	            {
	                if (StartPagePrinter(hPrinter) != 0)
	                {
	                    IntPtr pBytes = Marshal.StringToCoTaskMemAnsi(commandToOpenCashDrawer);
	                    long dwWritten;
	                    if (WritePrinter(hPrinter, pBytes, commandToOpenCashDrawer.Length, out dwWritten) != 0)
	                    {
	                        success = true;
	                    }
	                    Marshal.FreeCoTaskMem(pBytes);
	                    EndPagePrinter(hPrinter);
	                }
	                EndDocPrinter(hPrinter);
	            }
	            ClosePrinter(hPrinter);
	        }
					return success;
	    }

	    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
	    public static extern long ClosePrinter(IntPtr hPrinter);

	    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
	    public class DOCINFOA
	    {
	        [MarshalAs(UnmanagedType.LPStr)]
	        public string pDocName;
	        [MarshalAs(UnmanagedType.LPStr)]
	        public string pOutputFile;
	        [MarshalAs(UnmanagedType.LPStr)]
	        public string pDataType;
	    }
      public async Task<object> Invoke(dynamic input)
      {		
      		bool success = OpenCashDrawer("BIXOLON SRP-350plusIII");

					if (success){
					    Console.WriteLine("Cash drawer opened successfully.");
					}else{
					    Console.WriteLine("Failed to open cash drawer.");
					}

          return "defaultPrinter";
      }	
	  }
	*/});
	

	toOpenCashDrawer(null, function (error, result) {
	    if (error) {
	    	console.log(error,'error')
	    }else{
	    	console.log(result, 'result')
	    }
	});


 var LABEL_PRINTINGS = edge.func(function () {/*
    using System;
    using System.Threading.Tasks;
    using System.IO;
    using System.IO.Ports;
    using System.Runtime.InteropServices;
    using System.Text;
    
    public class Startup
    { 

      [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
      public class DOCINFOA
      {
          [MarshalAs(UnmanagedType.LPStr)] public string pDocName;
          [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile;
          [MarshalAs(UnmanagedType.LPStr)] public string pDataType;
      }

      [DllImport("winspool.Drv", EntryPoint = "OpenPrinterA", SetLastError = true, CharSet = CharSet.Ansi, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool OpenPrinter([MarshalAs(UnmanagedType.LPStr)] string szPrinter, out IntPtr hPrinter, IntPtr pd);

      [DllImport("winspool.Drv", EntryPoint = "ClosePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool ClosePrinter(IntPtr hPrinter);

      [DllImport("winspool.Drv", EntryPoint = "StartDocPrinterA", SetLastError = true, CharSet = CharSet.Ansi, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool StartDocPrinter(IntPtr hPrinter, Int32 level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOA di);

      [DllImport("winspool.Drv", EntryPoint = "EndDocPrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool EndDocPrinter(IntPtr hPrinter);

      [DllImport("winspool.Drv", EntryPoint = "StartPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool StartPagePrinter(IntPtr hPrinter);

      [DllImport("winspool.Drv", EntryPoint = "EndPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool EndPagePrinter(IntPtr hPrinter);

      [DllImport("winspool.Drv", EntryPoint = "WritePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
      public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, Int32 dwCount, out Int32 dwWritten);

      // SendBytesToPrinter()
      // When the function is given a printer name and an unmanaged array
      // of bytes, the function sends those bytes to the print queue.
      // Returns true on success, false on failure.
      public static bool SendBytesToPrinter(string szPrinterName, IntPtr pBytes, Int32 dwCount, string jobName)
      {
          Int32 dwError = 0, dwWritten = 0;
          IntPtr hPrinter = new IntPtr(0);
          DOCINFOA di = new DOCINFOA();
          bool bSuccess = false; // Assume failure unless you specifically succeed.
          di.pDocName = jobName;
          di.pDataType = "RAW";

          Console.WriteLine("OpenPrinter(szPrinterName.Normalize(), out hPrinter, IntPtr.Zero)"+OpenPrinter(szPrinterName.Normalize(), out hPrinter, IntPtr.Zero));
          // Open the printer.
          if (OpenPrinter(szPrinterName.Normalize(), out hPrinter, IntPtr.Zero))
          {
              // Start a document.
              if (StartDocPrinter(hPrinter, 1, di))
              {
                  // Start a page.
                  if (StartPagePrinter(hPrinter))
                  {
                      // Write your bytes.
                      bSuccess = WritePrinter(hPrinter, pBytes, dwCount, out dwWritten);
                      EndPagePrinter(hPrinter);
                  }
                  EndDocPrinter(hPrinter);
              }
              ClosePrinter(hPrinter);
          }
          Console.WriteLine("sd ");
          return bSuccess;
      }
      public static bool SendBytesToPrinter(string szPrinterName, byte[] szBytes, string jobName)
      {
          IntPtr pBytes;
          Int32 dwCount;

          dwCount = Convert.ToInt32(szBytes.Length);
          pBytes = Marshal.AllocCoTaskMem(dwCount);
          Marshal.Copy(szBytes, 0, pBytes, dwCount);

          // Send the converted ANSI string to the printer.
          bool res = SendBytesToPrinter(szPrinterName, pBytes, dwCount, jobName);
          Marshal.FreeCoTaskMem(pBytes);
          return res;
      }
      public static bool SendBytesToPrinter(string printerName, byte[] bytes){
            bool bSuccess = false;
            IntPtr pUnmanagedBytes = new IntPtr(0);
            int nLength = bytes.Length;
            // Allocate some unmanaged memory for those bytes.  
            pUnmanagedBytes = Marshal.AllocCoTaskMem(nLength);
            // Copy the managed byte array into the unmanaged array.  
            Marshal.Copy(bytes, 0, pUnmanagedBytes, nLength);
            // Send the unmanaged bytes to the printer.  
            bSuccess = SendBytesToPrinter(printerName, pUnmanagedBytes, nLength, "ddd");
            // Free the unmanaged memory that you allocated earlier.  
            Marshal.FreeCoTaskMem(pUnmanagedBytes);
            return bSuccess;
      }
      public async Task<object> Invoke(dynamic print_Obj)
      {   
          
          var zplData = @"
            ^XA
            ^FO20,20,^A0,30^FDWorld's Best Griddle^FS
            ^FO 20,70
            ^BCN,100,Y,N,N,A
            ^FD
            1200175210748180923
            ^FS
            ^XZ
          ";
          Console.WriteLine("zplData "+ zplData);
          byte[] bindata = Encoding.Default.GetBytes(zplData);
          bool success = false;
          success = SendBytesToPrinter("BIXOLON SLP-DX420", bindata);
          return success;
      }
    }
  */});




  namespace PrintPdfFile
{
 public class RawPrinterHelper
 {
 // Structure and API declarions:
 [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
 private class DOCINFOA
 {
 [MarshalAs(UnmanagedType.LPStr)]
 public string pDocName;
 [MarshalAs(UnmanagedType.LPStr)]
 public string pOutputFile;
 [MarshalAs(UnmanagedType.LPStr)]
 public string pDataType;
 }
 
 #region dll Wrappers
 [DllImport("winspool.Drv", EntryPoint = "OpenPrinterA", SetLastError = true, CharSet = CharSet.Ansi, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool OpenPrinter([MarshalAs(UnmanagedType.LPStr)] string szPrinter, out IntPtr hPrinter, IntPtr pd);
 
 [DllImport("winspool.Drv", EntryPoint = "ClosePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool ClosePrinter(IntPtr hPrinter);
 
 [DllImport("winspool.Drv", EntryPoint = "StartDocPrinterA", SetLastError = true, CharSet = CharSet.Ansi, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool StartDocPrinter(IntPtr hPrinter, Int32 level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOA di);
 
 [DllImport("winspool.Drv", EntryPoint = "EndDocPrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool EndDocPrinter(IntPtr hPrinter);
 
 [DllImport("winspool.Drv", EntryPoint = "StartPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool StartPagePrinter(IntPtr hPrinter);
 
 [DllImport("winspool.Drv", EntryPoint = "EndPagePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool EndPagePrinter(IntPtr hPrinter);
 
 [DllImport("winspool.Drv", EntryPoint = "WritePrinter", SetLastError = true, ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
 private static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, Int32 dwCount, out Int32 dwWritten);
 
 [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
 public static extern bool GetDefaultPrinter(StringBuilder pszBuffer, ref int size);
 
 #endregion dll Wrappers
 
 #region Methods
 /// <summary>
 /// This function gets the pdf file name.
 /// This function opens the pdf file, gets all its bytes & send them to print.
 /// </summary>
 /// <param name="szPrinterName">Printer Name</param>
 /// <param name="szFileName">Pdf File Name</param>
 /// <returns>true on success, false on failure</returns>
 public static bool SendFileToPrinter(string pdfFileName)
 {
 try
 {
 #region Get Connected Printer Name
 PrintDocument pd = new PrintDocument();
 StringBuilder dp = new StringBuilder(256);
 int size = dp.Capacity;
 if (GetDefaultPrinter(dp, ref size))
 {
 pd.PrinterSettings.PrinterName = dp.ToString().Trim();
 }
 #endregion Get Connected Printer Name
 
 // Open the PDF file.
 FileStream fs = new FileStream(pdfFileName, FileMode.Open);
 // Create a BinaryReader on the file.
 BinaryReader br = new BinaryReader(fs);
 Byte[] bytes = new Byte[fs.Length];
 bool success = false;
 // Unmanaged pointer.
 IntPtr ptrUnmanagedBytes = new IntPtr(0);
 int nLength = Convert.ToInt32(fs.Length);
 // Read contents of the file into the array.
 bytes = br.ReadBytes(nLength);
 // Allocate some unmanaged memory for those bytes.
 ptrUnmanagedBytes = Marshal.AllocCoTaskMem(nLength);
 // Copy the managed byte array into the unmanaged array.
 Marshal.Copy(bytes, 0, ptrUnmanagedBytes, nLength);
 // Send the unmanaged bytes to the printer.
 success = SendBytesToPrinter(pd.PrinterSettings.PrinterName, ptrUnmanagedBytes, nLength);
 // Free the unmanaged memory that you allocated earlier.
 Marshal.FreeCoTaskMem(ptrUnmanagedBytes);
 return success;
 }
 catch (Exception ex)
 {
 throw new Exception(ex.Message);
 }
 }
 
 /// <summary>
 /// This function gets the printer name and an unmanaged array of bytes, the function sends those bytes to the print queue.
 /// </summary>
 /// <param name="szPrinterName">Printer Name</param>
 /// <param name="pBytes">No. of bytes in the pdf file</param>
 /// <param name="dwCount">Word count</param>
 /// <returns>True on success, false on failure</returns>
 private static bool SendBytesToPrinter(string szPrinterName, IntPtr pBytes, Int32 dwCount)
 {
 try
 {
 Int32 dwError = 0, dwWritten = 0;
 IntPtr hPrinter = new IntPtr(0);
 DOCINFOA di = new DOCINFOA();
 bool success = false; // Assume failure unless you specifically succeed.
 
 di.pDocName = "PDF Document";
 di.pDataType = "RAW";
 
 // Open the printer.
 if (OpenPrinter(szPrinterName.Normalize(), out hPrinter, IntPtr.Zero))
 {
 // Start a document.
 if (StartDocPrinter(hPrinter, 1, di))
 {
 // Start a page.
 if (StartPagePrinter(hPrinter))
 {
 // Write the bytes.
 success = WritePrinter(hPrinter, pBytes, dwCount, out dwWritten);
 EndPagePrinter(hPrinter);
 }
 EndDocPrinter(hPrinter);
 }
 ClosePrinter(hPrinter);
 }
 
 // If print did not succeed, GetLastError may give more information about the failure.
 if (success == false)
 {
 dwError = Marshal.GetLastWin32Error();
 }
 return success;
 }
 catch (Exception ex)
 {
 throw new Exception(ex.Message);
 }
 }
 #endregion Methods
 }
}
//Testing above code
 
class Program
 
{
 
static void Main(string[] args)
 
{
 
try
 
{
RawPrinterHelper.SendFileToPrinter(@"E:\XYZDocs\XYZ.pdf");
}
 
catch (Exception ex)
 
{
 
Console.WriteLine(ex.Message);
 
}
 
}
 
}