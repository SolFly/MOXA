const ModbusRTU = require("modbus-serial");

const client = new ModbusRTU();
client.connectTCP("192.168.0.101", { port: 4001 })
    .then(function () {
        console.log("Connected to MOXA");
        return client.readInputRegisters(0x0100, 2, { unitId: 5 });
    })
    .then(function (data) {
        if (data && data.data) {
            console.log("Active Power:", data.data.readInt32BE());
        } else {
            console.log("No data received from slave 5.");
        }
        client.close();
    })
    .catch(function (e) {
        console.log("Error reading data from slave 5:", e.message);
        client.close();
    });
