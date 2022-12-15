'use strict';

const Chance = require('chance');
const chance = new Chance();

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io(`http://localhost:3001/caps`); // replace with deployed URL when deployed
// const PORT = process.env.PORT || 3002;

const randomStore = chance.pickone(['1-800-flowers', 'acme-widgets']);
socket.emit('join', randomStore);

// socket.emit('getAll', {
//   store: randomStore,
//   event: 'received',
// });

let intervalID;

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
  }, 3000);

  socket.on('delivered', (payload) => {
    console.log('Thank you,', payload.payload.customer);
    console.log('Order:', payload.payload.orderID);
    console.log('Has been successfully delivered to: ');
    console.log(payload.payload.address);
  });
};

function stop() {
  clearInterval(intervalID, 4000);
};

readyForPickUp();

module.exports = readyForPickUp;
