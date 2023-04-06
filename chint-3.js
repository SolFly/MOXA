const ModbusRTU = require('modbus-serial');

const client = new ModbusRTU();

client.connectTCP("192.168.0.101", { port: 4001 })
  .then(() => {
    console.log("Connected to MOXA");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

const registerAddress = 3205; // Address of the holding register for active power parameter

// Array to store the results
const results = {};

// Read data from multiple slaves
for (let i = 1; i <= 30; i++) {
  client.setID(i);
  readData(i);
}

// Function to read data from a slave device
function readData(slaveId) {
  client.readHoldingRegisters(registerAddress, 1)
    .then((data) => {
      const result = data.data.readInt32BE();
      console.log(`Slave ${slaveId} - Result: ${result}`);
      results[`TR${slaveId}`] = result;
    })
    .catch((err) => {
      console.log(`Error reading data from slave ${slaveId}:`, err);
      results[`TR${slaveId}`] = null;
    });
}

// Serve the results on a web server
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('MOXA data is being read and served at /data');
});

app.get('/data', (req, res) => {
  res.json(results);
});

app.listen(port, () => {
  console.log(`Web server listening at http://localhost:${port}`);
});
