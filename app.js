var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

const port = 2023;
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");

const _help_ = require('./Services/Helper.js');

app.listen(port, () => {
	console.log(`App is running http://localhost:${port}`)
})

app.get('/', async (req, res) => {
	 let machine_user = _help_.get_Machine_UserName();
	 let list_serial_ports = _help_.list_of_serial_ports();
	 let list_printers = await _help_.getListOfPrinters();

	 const POS_PRINTER = _help_.get_pos_printers();
	 const LABEL_PRINTER = _help_.get_label_printers();
	 const WHOLESALE_PRINTER = _help_.get_wholesale_printers();
	 const DISPLAY_POLE_PORT = _help_.get_display_pole_ports();

	 res.render(path.resolve(__dirname, "./views/index") , {
	 	 runing_port: port,
	 	 machine_user: machine_user,
	 	 list_printers: list_printers,
	 	 list_serial_ports: list_serial_ports,
	 	 POS_PRINTER: POS_PRINTER,
	 	 LABEL_PRINTER: LABEL_PRINTER,
	 	 WHOLESALE_PRINTER: WHOLESALE_PRINTER,
	 	 DISPLAY_POLE_PORT: DISPLAY_POLE_PORT,

	 });
});

app.post('/config_update', async (req, res) => {
	const data = fs.readFileSync(path.resolve(__dirname, "./config.json"));
	const jsonData = JSON.parse(data);
	jsonData.data[req.body.type] = req.body.printer_name;
	fs.writeFileSync(path.resolve(__dirname, "./config.json"), JSON.stringify(jsonData))
	res.send('Success')
});


module.exports = app;