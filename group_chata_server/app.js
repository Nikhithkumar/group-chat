const express = require('express');
const app = express();
app.get('/', (req, res) => {
	res.send('Group Chat Backend Running!');
});
module.exports = app;
