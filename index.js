
import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: 'http://localhost:3000'
    }
});

let users = [];

const addNewUser = (username, socketId) => {
    if (users.every(user => user.username !== username)) {
        users.push({ username, socketId })
    }
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (username) => {
    let user = users.find(user => user.username === username)
    if (user) {
        return user
    } else {
        return null
    }
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("addNewUser", (username) => {
        addNewUser(username, socket.id);
        io.emit("sendUser", users)
    })

    socket.on("sendNotify", ({ sender, receiver, type }) => {
        let { socketId } = getUser(receiver);
        // console.log(receivername);
        socketId && io.to(socketId).emit("getNotify", { sender, type })
    })

    socket.on("disconnect", () => {
        console.log('A user disconnected');
        removeUser(socket.id)
    })
});

io.listen(4000);