'use strict';

// const eventPool = require('../../../EventEmitter');
const Chance = require('chance');
const chance = new Chance();

require('dotenv').config();
const { io } = require('socket.io-client');
// const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:3001/caps`); // replace with deployed URL when deployed

socket.emit('join', 'Socket Room');

let intervalID;

function readyForPickUp() {
  intervalID = setInterval(() => {
    let payload = {
      store: '1-206-flowers',
      orderID: chance.guid(),
      customer: chance.name(),
      address: chance.address({ short_suffix: true }),
    };
    // eventPool.emit('PICKUP', payload);
    socket.emit('pickup', payload);
    stop();
  }, 3000);
  // eventPool.on('DELIVERED', (payload) => {
  //   console.log('Thank you,', payload.customer);
  // });
  socket.on('delivered', (payload) => {
    console.log('Thank you,', payload.customer);
    console.log('Order:', payload.orderID);
    console.log('Has been successfully delivered to: ');
    console.log(payload.address);
  });
};

function stop() {
  clearInterval(intervalID, 4000);
};

readyForPickUp();

module.exports = readyForPickUp;
