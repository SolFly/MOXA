# MOXA
Node.js server code that reads data from a MOXA server over TCP/IP connection using the Modbus TCP protocol.

This code uses the jsmodbus package to communicate with the MOXA server over TCP/IP using the Modbus TCP protocol, and the express package to create a web server.

The USSStartAddress and USSEndAddress variables are set to the starting and ending USS addresses to read from. The data variable is an array to store the data read from the MOXA server.

The socket.on('connect', ...) function reads data from the MOXA server for all USS addresses from USSStartAddress to USSEndAddress using a for loop. 
The client.readInputRegisters() function is called with the unitId option set to the current address being read from. 
The data is stored in the data array at the index corresponding to the address minus 1.

The app.get(...) function sets up an HTTP GET route for the root URL (/) of the web server. 
When a GET request is received, the stats variable is constructed by iterating over the USS addresses and corresponding data stored in the data array. 
The stats variable is then sent as the response to the client.

Finally, the web server is started on port 3000 using the app.listen() function.

You will need to adjust the host and port options passed to the socket.connect() function to connect to your MOXA server, and make sure the MOXA server is configured to expose the addresses you want to read from over Modbus.
