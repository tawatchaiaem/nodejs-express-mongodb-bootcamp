const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('newSale',() =>{
    console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
    console.log("Custumer name: Tawatchai")
});

myEmitter.emit("newSale");
