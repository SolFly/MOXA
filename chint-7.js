const ModbusRTU = require("modbus-serial");

// create a modbus client
const client = new ModbusRTU();

// set the slave ID
const slaveId = 1;

// set the number of registers to read
const numRegisters = 2;

// set the starting address of the registers
const startAddress = 40001;

// set the connection parameters
const connectionParams = {
  host: "192.168.0.22",
  port: 966,
};

// connect to the modbus server
client.connectTCP(connectionParams);

// read the registers and print the values
client
  .readInputRegisters(startAddress, numRegisters, { unitId: slaveId })
  .then((data) => {
    console.log("Active Power: " + data.data.readInt32BE(0));
  })
  .catch((err) => {
    console.log("Error reading data from slave " + slaveId + ": " + err.message);
  })
  .finally(() => {
    client.close();
  });
