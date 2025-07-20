const mongoose = require('mongoose');

let isDBConnected = false;

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		isDBConnected = true;
		console.log('✅ MongoDB Connected');
	} catch (err) {
		isDBConnected = false;
		console.error('❌ MongoDB connection failed. Fallback to in-memory store.');
	}
};

const getDBStatus = () => isDBConnected;

module.exports = { connectDB, getDBStatus };
