'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io(`http://localhost:3001/caps`);

socket.on('pickup', pickedUp);

function pickedUp(payload, messageID) {
  // setTimeout(() => {
  console.log('DRIVER:------------------- RECEIVED -------------------');
  console.log('Received Order:', payload.payload.orderID);
  socket.emit('getAll', {
    store: payload.payload.store,
    event: 'pickup',
  });
  setTimeout(() => {
    socket.emit('received', {
      store: payload.payload.store,
      messageID: messageID,
      event: payload.event,
    });
  }, 5000);
  // }, 500);
  setTimeout(() => {
    console.log('DRIVER:------------------- PICKED-UP -------------------');
    console.log('Picked Up Order:', payload.payload.orderID);
    // eventPool.emit('IN-TRANSIT', payload);
    socket.emit('in-transit', payload);
  }, 2000);

  setTimeout(() => {
    console.log('DRIVER:------------------- DELIVERED -------------------');
    console.log('Delivered Order:', payload.payload.orderID);
    // eventPool.emit('DELIVERED', payload);
    socket.emit('delivered', payload);
  }, 3500);
}

module.exports = pickedUp;
