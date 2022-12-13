'use strict';

const eventPool = require('./EventEmitter');
// const readyForPickUp = require('./src/events/vendor');
require ('./src/events/vendor');
require ('./src/events/driver');

// readyForPickUp();

eventPool.on('PICKUP', (payload) => logger('pickup', payload));
eventPool.on('IN-TRANSIT', (payload) => logger('in-transit', payload));
eventPool.on('DELIVERED', (payload) => logger('delivered', payload));

function logger(event, payload) {
  let log = {
    event: event,
    time: new Date(),
    payload: payload,
  };
  console.log('EVENT:', log);
}

module.exports = logger;

// function pickUpHandler(payload) {
//   let event = {
//     event: 'pickup',
//     time: new Date(),
//     payload: payload,
//   };
//   console.log('EVENT', event);
// }

// function inTransitHandler(payload) {
//   let event = {
//     event: 'in-transit',
//     time: new Date(),
//     payload: payload,
//   };
//   console.log('EVENT', event);
// }

// function deliveredHandler(payload) {
//   let event = {
//     event: 'delivered',
//     time: new Date(),
//     payload: payload,
//   };
//   console.log('EVENT', event);
// }

// module.exports = {
//   pickUpHandler,
//   inTransitHandler,
//   deliveredHandler,
// };
