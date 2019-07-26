const EventEmitter = require('events');

class Task extends Object {
	constructor(id, task){
		super();
		this.id = id;
		this.text = task;
	}
}
class Server extends EventEmitter {
	constructor(client){
		super();

		this.taskList = []
		this.currentTaskId = 0;

		// Prompt user for a command
		process.nextTick(() => this.emit('response', 'Type a command (help to see commands)'));
		client.on('command', (command, args) => {
			switch (command) {
				case 'help':
				case 'add':
				case 'ls':
				case 'delete':
					this[command](args);
					break;
				default:
					this.emit('response', 'Unknown command')
			}
		});
	}

	help() {
		this.emit('response', `Available Commands:
			add task
			ls
			deleted :id`);
	}

	add(args) {
		this.currentTaskId++;
		this.taskList.push(new Task(this.currentTaskId, args.join(' ')))
		this.emit('response', `Added task ${this.currentTaskId}`);
	}

	ls() {
		var listedTasks = this.taskList.map(t => `${t.id}: ${t.text}`);
		this.emit('response', listedTasks.join('\n'));
	}

	delete(args) {
		var index = this.taskList.findIndex(t => t.text === args)
		this.taskList.splice(index - 1, 1)
		this.emit('response', `Deleted task ${args[0]}`);
		this.currentTaskId--;
		this.taskList.map(t => t.id = this.taskList.indexOf(t) + 1);
	}
}

module.exports = (client) => new Server(client);