const ModbusRTU = require('modbus-serial');
const express = require('express');

const app = express();
const port = 3000;

const client = new ModbusRTU();

// Configure RTU settings
client.setID(1);
client.setDelay(100);
client.setTimeout(1000);

// Define register addresses for the Chint inverters
const registerAddresses = [
  30517,  // DC voltage
  30521,  // DC current
  30525,  // AC voltage
  30529,  // AC current
  30533,  // AC power
  30535,  // AC frequency
  30537,  // Energy generated
  30547,  // Inverter status
];

// Define a function to read a single register
const readRegister = async (address) => {
  try {
    const data = await client.readInputRegisters(address, 2);
    return (data.data[0] << 16) + data.data[1];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Define a function to read all registers for the Chint inverters
const readRegisters = async () => {
  const data = {};
  for (let i = 0; i < registerAddresses.length; i++) {
    const value = await readRegister(registerAddresses[i]);
    data[`register${i+1}`] = value;
  }
  return data;
};

// Define a route to serve the Chint inverter data
app.get('/chint', async (req, res) => {
  const data = await readRegisters();
  res.json(data);
});

// Start the web server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Open the serial port and connect to the MOXA
client.connectTCP("192.168.0.101", { port: 4001 })
  .then(() => {
    console.log('Connected to MOXA');
  })
  .catch((error) => {
    console.log(error);
  });
