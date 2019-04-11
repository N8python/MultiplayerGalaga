const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
let app = express();
app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);
io.on("connection", socket => {
    console.log("New user connected.")
    socket.emit("idSent", {
        id: Math.random()
    });
    socket.on("playerDataOut", data => {
        socket.broadcast.emit("playerDataIn", data)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected!");
    })
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});