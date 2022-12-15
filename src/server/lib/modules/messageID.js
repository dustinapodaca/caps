'use strict';

const Chance = require('chance');
const chance = new Chance();

// generate new messageID and export it
let messageID = chance.fbid();
module.exports = messageID;
