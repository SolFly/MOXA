const express = require('express');
const app = express();
const port = 3000;

const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

client.connectTCP("192.168.0.22", { port: 966 });

let startAddress = 4151;
let numberOfRegisters = 2;

let slaves = Array.from({length: 10}, (_, i) => i + 1); // Slave addresses 1-10

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

setInterval(() => {
  console.log('Connected to MOXA');
  slaves.forEach((slave) => {
    client.readInputRegisters(startAddress, numberOfRegisters, slave)
      .then((data) => {
        let power = (data.data[0] << 16) + data.data[1]; // Combine two 16-bit registers into one 32-bit value
        console.log(`Slave ${slave} active power: ${power}`);
        // Send data to web server
        app.get(`/slave${slave}`, (req, res) => {
          res.send(`Active power for slave ${slave}: ${power}`);
        });
      })
      .catch((err) => {
        console.log(`Error reading data from slave ${slave}: ${err}`);
      });
  });
}, 1000);
