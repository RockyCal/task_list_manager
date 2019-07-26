const EventEmitter = require('events');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	outputt: process.stdout
});

const client = new EventEmitter();
const server = require('./server')(client);

server.on('response', (resp) => {
	process.stdout.write(resp);
	process.stdout.write('\n\>');
})

let command, args;
rl.on('line', (input) => {
	[command, ...args] = input.split(' ')
	client.emit('command', command, args)
})