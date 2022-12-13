'use strict';

const eventPool = require('./EventEmitter');
const readyForPickUp = require('./src/events/vendor');
require ('./src/events/driver');

readyForPickUp();

eventPool.on('PICKUP', pickUpHandler);
eventPool.on('IN-TRANSIT', inTransitHandler);
eventPool.on('DELIVERED', deliveredHandler);

function pickUpHandler(payload) {
  let event = {
    event: 'pickup',
    time: new Date(),
    payload: payload,
  };
  console.log('EVENT', event);
}

function inTransitHandler(payload) {
  let event = {
    event: 'in-transit',
    time: new Date(),
    payload: payload,
  };
  console.log('EVENT', event);
}

function deliveredHandler(payload) {
  let event = {
    event: 'delivered',
    time: new Date(),
    payload: payload,
  };
  console.log('EVENT', event);
}

module.exports = {
  pickUpHandler,
  inTransitHandler,
  deliveredHandler,
};
