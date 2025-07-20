const messages = [];
const users = new Set();

function addMessage(msg) {
	if (messages.length >= 20) messages.shift();
	messages.push(msg);
}

function getMessages() {
	return [...messages];
}

function addUser(username) {
	users.add(username);
}

function userExists(username) {
	return users.has(username);
}

module.exports = {
	addMessage,
	getMessages,
	addUser,
	userExists,
};
