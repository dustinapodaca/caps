'use strict';

const eventHub = require('../hub');

let consoleSpy;
beforeEach(async () => {
  consoleSpy = await jest.spyOn(console, 'log').mockImplementation();
});
afterEach(async () => {
  await consoleSpy.mockRestore();
});

describe('Event Hub', () => {
  it('should log the pickup event', async () => {
    eventHub.pickUpHandler();
    await consoleSpy();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should log the in-transit event', async () => {
    eventHub.inTransitHandler();
    await consoleSpy();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should log the delivered event', async () => {
    eventHub.deliveredHandler();
    await consoleSpy();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
