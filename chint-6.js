const modbus = require('jsmodbus');
const net = require('net');

const client = new modbus.client.TCP(net.connect({host: '192.168.0.22', port: 966}));

const slaveIds = [1, 2, 3, 4, 5];

const readData = async (slaveId) => {
  try {
    const res = await client.readInputRegisters(40197, 2, { unitId: slaveId });
    const [hiByte, loByte] = res.data;
    const activePower = hiByte * 65536 + loByte;
    console.log(`Slave ${slaveId} Active Power: ${activePower}W`);
    return activePower;
  } catch (e) {
    console.log(`Error reading data from slave ${slaveId}: ${e.message}`);
    return null;
  }
};

client.connect();

client.on('connect', async function () {
  console.log('Connected to MOXA');
  try {
    const activePowerData = await Promise.all(slaveIds.map(slaveId => readData(slaveId)));
    console.log('Active Power Data:', activePowerData);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

client.on('error', function (err) {
  console.log('Connection Error:', err);
  client.close();
});
