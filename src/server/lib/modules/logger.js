'use strict';

module.exports = (event, payload) => {
  let log = {
    event: event,
    time: new Date(),
    payload: payload,
  };
  return log;
};
