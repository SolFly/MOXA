const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();
const slaveAddress = 1; // Replace with your slave address
const startAddress = 30775; // Replace with your start address
const numberOfRegisters = 2; // Replace with your number of registers

// Set the IP address and port of the MOXA
client.connectTCP("192.168.0.22", { port: 4001 });

// Read the specified number of registers starting at the specified address
client.readHoldingRegisters(startAddress, numberOfRegisters, function(err, data) {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log(`Data read from slave ${slaveAddress}:`, data);
  }

  // Close the connection
  client.close();
});
