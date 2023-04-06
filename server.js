const Modbus = require('jsmodbus');
const net = require('net');
const express = require('express');

const USSStartAddress = 1; // specify the starting USS address of your MOXA server
const USSEndAddress = 30; // specify the ending USS address of your MOXA server

const app = express();

const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, USSStartAddress);

let data = [];

socket.on('connect', function() {
    // read data from MOXA server for all USS addresses
    for (let address = USSStartAddress; address <= USSEndAddress; address++) {
        client.readInputRegisters(0, 10, { unitId: address })
            .then(function(res) {
                data[address - 1] = res.response.data;
            }).catch(function(err) {
                console.log(err);
            });
    }
});

socket.connect({
    host: '192.168.0.101',
    port: 4001
});

app.get('/', function(req, res) {
    let stats = [];
    for (let i = USSStartAddress; i <= USSEndAddress; i++) {
        stats.push({
            address: i,
            data: data[i - 1]
        });
    }
    res.send(stats);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
