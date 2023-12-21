const edge = require('electron-edge-js');
const {ipcRenderer} = require('electron')

const path = require('path');
const fs = require('fs');


function get_Machine_UserName() {
	var Machine_USER = edge.func(function () {/*
		using System;
		using System.Threading.Tasks;

		public class Startup
		{		
			public async Task<object> Invoke(dynamic input)
			{	 
				return System.Environment.MachineName + "\\" + Environment.UserName ;
			}
		}
	*/});
	let rtn = '';
	Machine_USER(null, function (error, result) {
		if (error) {
			console.log(error,'error')
		}else{
			rtn = result;
		}
	});
	return rtn; 
}


function list_of_serial_ports() {
	var displayPOlEPorts = edge.func(function () {/*
   using System;
   using System.Threading.Tasks;
   using System.IO.Ports;
    public class Startup
    {    
      public async Task<object> Invoke(dynamic display_Obj)
      {    
        string[] ports = SerialPort.GetPortNames();
        return ports;
      }
    }
  */});

	let rtn = [];
  displayPOlEPorts(null, function (error, result) {
    if (error) {
    	console.log(error, 'error');
    }else{
    	rtn = result;
    }
  });
  return rtn
}


function get_Machine_HostNameandMACAddress() {
	var Machine_USER_MAC = edge.func(function () {/*
		using System;
		using System.Threading.Tasks;
		using System.Net;
		using System.Net.NetworkInformation;
		using System.Text;
		using System.Collections.Generic;

		public class Startup
		{				
			class MAC_LIST {
			  public string Mac_addr { get; set; }
			  public string Description { get; set; }
			}
			class FinalResponse
			{
        public string hostName { get; set; }
        public List<MAC_LIST> mac_items { get; set; }
      }

			public async Task<object> Invoke(dynamic input)
			{	 
				IPGlobalProperties computerProperties = IPGlobalProperties.GetIPGlobalProperties();
				NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();

				List<MAC_LIST> items = new List<MAC_LIST>();
				FinalResponse packet = new FinalResponse();
				packet.hostName = computerProperties.HostName;

				if (nics == null || nics.Length < 1)
				{
        	packet.mac_items = items;
					return packet;
				}				
				foreach (NetworkInterface adapter in nics)
				{
        	IPInterfaceProperties properties = adapter.GetIPProperties(); //  .GetIPInterfaceProperties();
        	PhysicalAddress address = adapter.GetPhysicalAddress();
        	byte[] bytes = address.GetAddressBytes();
        	string mac_addr = "";
        	for (int i = 0; i < bytes.Length; i++){
						mac_addr = mac_addr+""+bytes[i].ToString("X2");
            if (i != bytes.Length - 1){
                mac_addr = mac_addr +"-";
            }
          }
          items.Add(new MAC_LIST { Mac_addr = mac_addr, Description = adapter.Description});
        }
        packet.mac_items = items;
				return packet;
			}
		}
	*/});
	let rtn = {};
	Machine_USER_MAC(null, function (error, result) {
		if (error) {
			console.log(error,'error')
		}else{
			rtn = result;
		}
	});
	return rtn; 
}


async function getListOfPrinters(){
	let currentPrinter = await getAllPrinter();
	return currentPrinter;
}
function getAllPrinter(){
  ipcRenderer.send('getAllPrinter')
  return new Promise((resolve, reject)=> {
      ipcRenderer.on('res-AllPrinter', (event, arg)=> {
          resolve(arg)
      })
  })
}




function get_pos_printers(){
	 const data = fs.readFileSync(path.resolve(__dirname, "../config.json"));
	 const jsonData = JSON.parse(data);
	 const POS_PRINTER = jsonData.data["POS_PRINTER"] ? jsonData.data["POS_PRINTER"] : "-";
	 return POS_PRINTER;
};
function get_label_printers(){
	 const data = fs.readFileSync(path.resolve(__dirname, "../config.json"));
	 const jsonData = JSON.parse(data);
	 const LABEL_PRINTER = jsonData.data["LABEL_PRINTER"] ? jsonData.data["LABEL_PRINTER"] : "-";
	 return LABEL_PRINTER;
};

function get_wholesale_printers(){
	 const data = fs.readFileSync(path.resolve(__dirname, "../config.json"));
	 const jsonData = JSON.parse(data);
	 const WHOLESALE_PRINTER = jsonData.data["WHOLESALE_PRINTER"] ? jsonData.data["WHOLESALE_PRINTER"] : "-";
	 return WHOLESALE_PRINTER;
};

function get_display_pole_ports(){
	 const data = fs.readFileSync(path.resolve(__dirname, "../config.json"));
	 const jsonData = JSON.parse(data);
	 const DISPLAY_POLE_PORT = jsonData.data["DISPLAY_POLE_PORT"] ? jsonData.data["DISPLAY_POLE_PORT"] : "-";
	 return DISPLAY_POLE_PORT;
};

const generateRandomString = (length = 10) => Math.random().toString(20).substr(2, length)


function CommonPrinTPDFMethods(print_obj = {}){
	const unique_string = 'RES__'+generateRandomString();
  return new Promise((resolve, reject) => {
    ipcRenderer.send('GeneratePDF_FILE', print_obj, unique_string)
    ipcRenderer.on(`res-GeneratePDF_FILE_${unique_string}`,(event, arg) => {
        resolve(arg)
    })
  })
}

 const _help_ = {
	get_Machine_UserName, 
	getListOfPrinters, 
	get_pos_printers, 
	get_label_printers, 
	get_wholesale_printers, 
	get_Machine_HostNameandMACAddress, 
	list_of_serial_ports, 
	get_display_pole_ports, 
	generateRandomString, 
	CommonPrinTPDFMethods
}

module.exports = _help_

