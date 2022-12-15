'use strict';

// socket driver test
// mock socket

let socket = require('../../../socket');
const driver = require('../driver');

jest.mock('../../../socket', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});

describe('Driver', () => {
  // let consoleSpy;
  // beforeEach(async () => {
  //   consoleSpy = await jest.spyOn(console, 'log').mockImplementation();
  // });
  // afterEach(async () => {
  //   await consoleSpy.mockRestore();
  // });
  it('should listen for pickup event', () => {
    let payload = {
      store: '1-206-flowers',
      orderID: 'eef7c9a0-8b1f-4b0c-9c6b-9d9a8a0b5c6b',
      customer: 'Marty McFly',
      address: '1234 Hill Valley Drive',
    };
    driver(payload);
    expect(socket.on).toHaveBeenCalledWith('pickup', expect.any(Function));
  });
  it('should emit in-transit event', () => {
    expect(socket.emit).toHaveBeenCalledWith('in-transit', expect.any(Function));
  });
  it('should emit delivered event', () => {
    expect(socket.emit).toHaveBeenCalledWith('delivered', expect.any(Function));
  });
});




