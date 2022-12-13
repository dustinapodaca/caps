'use strict';

// const eventPool = require('../../../EventEmitter');

require('dotenv').config();
const { io } = require('socket.io-client');
// const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:3001/caps`);

// eventPool.on('PICKUP', pickedUp);
socket.on('pickup', pickedUp);

function pickedUp(payload) {
  setTimeout(() => {
    console.log('DRIVER: picked up', payload.orderID);
    // eventPool.emit('IN-TRANSIT', payload);
    socket.emit('in-transit', payload);
  }, 1000);

  setTimeout(() => {
    console.log('DRIVER: delivered', payload.orderID);
    // eventPool.emit('DELIVERED', payload);
    socket.emit('delivered', payload);
  }, 2000);
}

module.exports = pickedUp;
