const edge = require('electron-edge-js');
const path = require('path');
const fs = require('fs');

function to_Open_Cash_Drawer_USING_DLL(print_obj = {}){

  let sys_d_1 = path.resolve(__dirname, "../extraResources/Windows.Devices.PointOfService.dll");


  var toOpenCashDrawerUSINGDLL = edge.func({
   source: function() {/*
    using System;
    using System.Collections.Generic;
    using System.Text;
    using Windows.Devices.PointOfService;
    using System.Threading.Tasks;

    public class Startup
    {
      public async Task<object> Invoke(dynamic print_Obj)
      { 
     
        return print_Obj.printer;
      }
    } 
  */},
    // references: [ sys_d_1 ]
  });

  toOpenCashDrawerUSINGDLL(print_obj, function (error, result) {
    if (error) {
     console.log(error, 'error')
     throw error;
    }else{
     console.log(result, 'result')
    }
  });
}

function to_Open_Cash_Drawer(print_obj = {}){

	var toOpenCashDrawer = edge.func(function () {/*
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
      public static bool SendBytesToPrinter(string printerName, byte[] bytes){
            bool bSuccess = false;
            IntPtr pUnmanagedBytes = new IntPtr(0);
            int nLength = bytes.Length;
            // Allocate some unmanaged memory for those bytes.  
            pUnmanagedBytes = Marshal.AllocCoTaskMem(nLength);
            // Copy the managed byte array into the unmanaged array.  
            Marshal.Copy(bytes, 0, pUnmanagedBytes, nLength);
            // Send the unmanaged bytes to the printer.  
            bSuccess = SendBytesToPrinter(printerName, pUnmanagedBytes, nLength, "open_cash_drawer");
            // Free the unmanaged memory that you allocated earlier.  
            Marshal.FreeCoTaskMem(pUnmanagedBytes);
            return bSuccess;
      }
      public async Task<object> Invoke(dynamic print_Obj)
      {   
      		string openCommand = "\x1b\x70\x00\x19\xff";
          byte[] bindata = Encoding.Default.GetBytes(openCommand);
          byte[] openDrawerCommand = new byte[] { 0x1B, 0x70, 0x00, 0x19, 0xFA };
          bool success = false;
          success = SendBytesToPrinter(print_Obj.printer, bindata);
          return success;
      }
    }
  */});

	toOpenCashDrawer(print_obj, function (error, result) {
	    if (error) {
	    	console.log(error,'error')
	    }else{
	    	console.log(result, 'result')
	    }
	});
}

module.exports = {
	to_Open_Cash_Drawer,
  to_Open_Cash_Drawer_USING_DLL, 
}