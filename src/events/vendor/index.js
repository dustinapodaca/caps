'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io(`http://localhost:3001/caps`); // replace with deployed URL when deployed
const chance = require('../../server/lib/modules/newChance');

const randomStore = chance.pickone(['1-800-flowers', 'acme-widgets']);
let intervalID;

socket.emit('join', randomStore);

socket.emit('getAll', {
  store: randomStore,
  event: 'delivered',
});

//currying
// let callForPickUp = readyForPickUp(socket);
// callForPickUp(payload);

function readyForPickUp() {
  intervalID = setInterval(() => {
    let messageID = chance.fbid();
    let payload = {
      store: randomStore,
      orderID: chance.guid(),
      customer: chance.name(),
      address: chance.address({ short_suffix: true }),
    };
    socket.emit('pickup', {
      messageID: messageID,
      payload: payload,
    });
    stop();
  }, 3500);

  socket.on('in-transit', (payload, messageID) => {
    console.log('VENDOR:------------------- IN-TRANSIT -------------------')
    console.log('Thank you,', payload.payload.customer);
    console.log('Order:', payload.payload.orderID);
    console.log('Is in transit to: ');
    console.log(payload.payload.address);
    socket.emit('received', {
      store: payload.payload.store,
      messageID: messageID,
      event: payload.event,
    });
  });

  socket.on('delivered', (payload, messageID) => {
    console.log('VENDOR:------------------- DELIVERED -------------------')
    console.log('Thank you,', payload.payload.customer);
    console.log('Order:', payload.payload.orderID);
    console.log('Has been successfully delivered to: ');
    console.log(payload.payload.address);
    socket.emit('received', {
      store: payload.payload.store,
      messageID: messageID,
      event: payload.event,
    });
  });
};

function stop() {
  clearInterval(intervalID, 4500);
};

readyForPickUp();

module.exports = readyForPickUp;
