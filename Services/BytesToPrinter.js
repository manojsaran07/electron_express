const edge = require('electron-edge-js');
const {ipcRenderer} = require('electron');
const { to_Open_Cash_Drawer } = require('./OpenCashDrawer.js');

function BytesToPrinter(print_obj = {}) {
	var to_print_data = edge.func(function () {/*
		using System;
		using System.Threading.Tasks;
		using System.Runtime.InteropServices;
		
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
      public async Task<object> Invoke(dynamic print_Obj)
      {		
				
					byte[] bindata = Convert.FromBase64String(print_Obj.data);
      		bool success = false;
      		success = SendBytesToPrinter(print_Obj.printer, bindata, print_Obj.id);

          return success;
      }
	  }
	*/});
	


	// let print_obj = {
	// 	"data": "",
	// 	"id" : "",
	// 	"printer" : ""
	// };

	let retObj = {}
	to_print_data(print_obj, function (error, result) {
	    if (error) {
	    	retObj = {
	    		status: "failed",
	    		msg: error,
	    	}
	    }else{
	    	retObj = {
	    		status: "success",
	    	}
        let temp_obj = {
          "printer": print_obj.printer
        }
        to_Open_Cash_Drawer(temp_obj)
	    }
	});
	return retObj;
};


async function getPrintersObj(){
	let currentPrinter = await getDetaultPrinter();
	return currentPrinter;
}
function getDetaultPrinter(){
  ipcRenderer.send('getDetaultPrinter')
  return new Promise((resolve, reject)=> {
      ipcRenderer.on('res-getDetaultPrinter', (event, arg)=> {
          resolve(arg)
      })
  })
}


function stringToDisplayPole(display_Obj = {}){
  var displayPOlE = edge.func(function () {/*
   using System;
   using System.Threading.Tasks;
   using System.IO.Ports;

    public class Startup
    {    
      public async Task<object> Invoke(dynamic display_Obj)
      {    
         string comPortName = display_Obj.port; // Replace with the correct COM port name
         int baudRate = 9600; // Replace with the correct baud rate
         Parity parity = Parity.None; // Replace with the correct parity
         int dataBits = 8; // Replace with the correct data bits
         StopBits stopBits = StopBits.One; // Replace with the correct stop bits
         using (SerialPort serialPort = new SerialPort(comPortName, baudRate, parity, dataBits, stopBits)){
            try{
               serialPort.Open();
               serialPort.Write(Convert.ToString((char)12));
               serialPort.WriteLine(display_Obj.line_1); 
               serialPort.WriteLine((char)13 + display_Obj.line_2); 
               serialPort.Close();
               return "success";
            }
            catch (Exception ex)
            {
              Console.WriteLine("Error: " + ex.Message);
              return "Error: " + ex.Message;
            }
          }
         return "Nothing Happen";
      }
    }
  */});

  displayPOlE(display_Obj, function (error, result) {
      if (error) {
       console.log(error, 'error');
       throw error;
      }else{
       console.log(result, 'result');
      }
  });
}


module.exports = {BytesToPrinter, getPrintersObj, stringToDisplayPole}
