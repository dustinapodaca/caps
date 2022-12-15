'use strict';

class Queue {
  constructor() {
    this.data = {};
  }

  store(name, payload) {
    this.data[name] = payload;
  }

  read(name) {
    return this.data[name];
  }

  readAll() {
    return this.data;
  }

  delete(name) {
    let deleted = this.data[name];
    delete this.data[name];
    console.log('------------------------- DELETED -------------------------');
    console.log('deleted:', deleted);
    return deleted;
  }

  count() {
    return Object.keys(this.data).length;
  }

  isEmpty() {
    return this.count() === 0;
  }

  peek() {
    return Object.keys(this.data)[0];
  }

  peekAll() {
    return Object.keys(this.data);
  }

  enqueue(name, payload) {
    this.store(name, payload);
  }

  dequeue() {
    let name = this.peek();
    let payload = this.get(name);
    this.delete(name);
    return payload;
  }
}

module.exports = Queue;
