const Modbus = require('jsmodbus');
const net = require('net');
const express = require('express');

const app = express();

const MOXA1Host = '192.168.0.101'; // specify the IP address of MOXA1
const MOXA1Port = 4001; // specify the port of MOXA1
const MOXA1USSStartAddress = 1; // specify the starting USS address of MOXA1
const MOXA1USSEndAddress = 30; // specify the ending USS address of MOXA1

const MOXA2Host = '192.168.0.102'; // specify the IP address of MOXA2
const MOXA2Port = 4001; // specify the port of MOXA2
const MOXA2USSStartAddress = 1; // specify the starting USS address of MOXA2
const MOXA2USSEndAddress = 30; // specify the ending USS address of MOXA2

const initialRegister = 4152; // specify the initial register address
const lastRegister = 4152; // specify the last register address
const numberOfBytes = 2; // specify the number of bytes to read

let dataMOXA1 = [];
let dataMOXA2 = [];

const socketMOXA1 = new net.Socket();
const clientMOXA1 = new Modbus.client.TCP(socketMOXA1, MOXA1USSStartAddress);

socketMOXA1.on('connect', function() {
    // read data from MOXA1 for all USS addresses
    for (let address = MOXA1USSStartAddress; address <= MOXA1USSEndAddress; address++) {
        clientMOXA1.readInputRegisters(initialRegister, numberOfBytes, { unitId: address })
            .then(function(res) {
                dataMOXA1[address - 1] = combineRegisters(res.response.data);
            }).catch(function(err) {
                console.log(err);
            });
    }
});

socketMOXA1.connect({
    host: MOXA1Host,
    port: MOXA1Port
});

const socketMOXA2 = new net.Socket();
const clientMOXA2 = new Modbus.client.TCP(socketMOXA2, MOXA2USSStartAddress);

socketMOXA2.on('connect', function() {
    // read data from MOXA2 for all USS addresses
    for (let address = MOXA2USSStartAddress; address <= MOXA2USSEndAddress; address++) {
        clientMOXA2.readInputRegisters(initialRegister, numberOfBytes, { unitId: address })
            .then(function(res) {
                dataMOXA2[address - 1] = combineRegisters(res.response.data);
            }).catch(function(err) {
                console.log(err);
            });
    }
});

socketMOXA2.connect({
    host: MOXA2Host,
    port: MOXA2Port
});

app.get('/TR1', function(req, res) {
    let stats = [];
    for (let i = MOXA1USSStartAddress; i <= MOXA1USSEndAddress; i++) {
        stats.push({
            address: i,
            data: dataMOXA1[i - 1]
        });
    }
    res.send(stats);
});


app.get('/TR2', function(req, res) {
    let stats = [];
    for (let i = MOXA2USSStartAddress; i <= MOXA2USSEndAddress; i++) {
        stats.push({
            address: i,
            data: dataMOXA2[i - 1]
        });
    }
    res.send(stats);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
