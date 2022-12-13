'use strict';

const eventPool = require('../../../EventEmitter');

eventPool.on('PICKUP', pickedUp);

function pickedUp(payload) {
  setTimeout(() => {
    console.log('DRIVER: picked up', payload.orderID);
    eventPool.emit('IN-TRANSIT', payload);
  }, 1000);

  setTimeout(() => {
    console.log('DRIVER: delivered', payload.orderID);
    eventPool.emit('DELIVERED', payload);
  }, 2000);
}

module.exports = pickedUp;
