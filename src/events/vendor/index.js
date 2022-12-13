'use strict';

const eventPool = require('../../../EventEmitter');
const Chance = require('chance');
const chance = new Chance();

function readyForPickUp() {
  setInterval(() => {
    let payload = {
      store: '1-206-flowers',
      orderID: chance.guid(),
      customer: chance.name(),
      address: chance.address({ short_suffix: true }),
    };
    eventPool.emit('PICKUP', payload);
  }, 3000);
  eventPool.on('DELIVERED', (payload) => {
    console.log('Thank you,', payload.customer);
  });
}

readyForPickUp();

module.exports = readyForPickUp;

