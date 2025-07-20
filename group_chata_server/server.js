require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const { connectDB, getDBStatus } = require("./utils/db");
const User = require("./models/User");
const Message = require("./models/Message");
const inMemory = require("./utils/inMemoryStore");

connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  let username = "";

  socket.on("join", async (data, callback) => {
    if (typeof callback !== "function") {
      console.warn("Join called without a callback");
      return;
    }

    if (!data?.username?.trim()) {
      return callback({ error: "Username is required" });
    }

    username = data.username.trim();
    socket.username = username;

    if (getDBStatus()) {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }
    } else {
      if (!inMemory.userExists(username)) {
        inMemory.addUser(username);
      }
    }

    let messages = [];
    if (getDBStatus()) {
      messages = await Message.find({})
        .sort({ timestamp: -1 })
        .limit(30) 
        .lean();
    } else {
      messages = inMemory.getMessages(); 
    }

    io.emit("notification", `${username} joined the chat`);
    callback({ success: true, messages }); 
  });

  socket.on("loadMore", async (lastTimestamp, callback) => {
    if (!lastTimestamp || typeof callback !== "function") return;

    let olderMessages = [];
    if (getDBStatus()) {
      olderMessages = await Message.find({ timestamp: { $lt: lastTimestamp } })
        .sort({ timestamp: -1 })
        .limit(30)
        .lean();
    } else {
      olderMessages = inMemory.getMessagesBefore(lastTimestamp);
    }

    callback(olderMessages);
  });

  socket.on("message", async (text) => {
    if (!username || !text?.trim()) return;

    const messageObj = {
      username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    if (getDBStatus()) {
      const msg = new Message(messageObj);
      await msg.save();
    } else {
      inMemory.addMessage(messageObj);
    }

    io.emit("message", messageObj);
  });

  socket.on("disconnect", () => {
    if (username) {
      io.emit("notification", `${username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
