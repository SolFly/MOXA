const ModbusRTU = require("modbus-serial");
const net = require("net");
const express = require("express");

const app = express();

const MOXAHost = "192.168.0.101"; // specify the IP address of the MOXA gateway
const MOXAPort = 4001; // specify the port of the MOXA gateway
const baudRate = 9600; // specify the baud rate of the serial connection
const dataBits = 8; // specify the number of data bits
const stopBits = 1; // specify the number of stop bits
const parity = "none"; // specify the parity

const client = new ModbusRTU();

const readData = async (unitId, startAddress) => {
  try {
    const data = await client.readInputRegisters(startAddress, 2, { unitId });
    return (data.data[0] << 16) + data.data[1];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const connect = async () => {
  try {
    await client.connectTCP(MOXAHost, { port: MOXAPort });
    await client.setID(1);
    await client.setRTUConfig(baudRate, dataBits, stopBits, parity);
    console.log("Connected to MOXA gateway.");
  } catch (error) {
    console.log(error);
  }
};

let data = {};

const readAllData = async () => {
  for (let i = 1; i <= 30; i++) {
    data[i] = await readData(i, 4152);
  }
};

connect().then(() => {
  setInterval(readAllData, 1000);
});

app.get("/TR", (req, res) => {
  res.send(data);
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
