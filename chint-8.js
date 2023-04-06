const net = require('net');
const { ModbusMasterTcp } = require('jsmodbus');

// Set up the Modbus TCP master
const client = new ModbusMasterTcp(net.Socket());
client.connectTCP('192.168.0.22', { port: 966 });

// Define the slave addresses to read from
const slaveAddresses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Define the register to read
const register = {
  address: 4151,
  quantity: 2,
};

// Read data from each slave
Promise.all(slaveAddresses.map(async (slaveAddress) => {
  const response = await client.readHoldingRegisters(slaveAddress, register.address, register.quantity);
  console.log(`Slave ${slaveAddress} data: ${response.data.toString('hex')}`);
})).then(() => {
  console.log('All data read successfully');
}).catch((err) => {
  console.error(`Error reading data: ${err}`);
});
