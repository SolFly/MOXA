const ModbusAsync = require('modbus-async');
const net = require('net');

const client = ModbusAsync.createTCPClient({ host: '192.168.0.22', port: 966 });

const SLAVES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

client.on('connect', function () {
  console.log('Connected to MOXA');
  setInterval(readData, 1000);
});

client.on('error', function (err) {
  console.log('Error connecting to MOXA:', err.message);
});

function readData() {
  SLAVES.forEach(function (slave) {
    client.readHoldingRegisters(slave, 30775, 2)
      .then(function (data) {
        const activePower = ModbusAsync.getWord(data.buffer, 0);
        console.log(`Slave ${slave} active power: ${activePower}`);
      })
      .catch(function (err) {
        console.log(`Error reading data from slave ${slave}:`, err.message);
      });
  });
}
