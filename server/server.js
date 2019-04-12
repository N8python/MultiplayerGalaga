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
let red = 0;
let blue = 0;

function addToTeam() {
    if (red === blue) {
        if (Math.random() < 0.5) {
            red += 1;
            return "red";
        } else {
            blue += 1;
            return "blue"
        }
    } else if (red > blue) {
        blue += 1;
        return "blue"
    } else if (red < blue) {
        red += 1;
        return "red"
    }
}
io.on("connection", socket => {
    console.log("New user connected.")
    let id = Math.random();
    let team = addToTeam();
    socket.emit("idSent", {
        id,
        team
    });
    socket.on("playerDataOut", data => {
        socket.broadcast.emit("playerDataIn", data);
    })
    socket.on("playerDeath", data => {
        if (data.team === "red") {
            red--;
        } else if (data.team === "blue") {
            blue--;
        }
        socket.broadcast.emit("removePlayer", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected!");
        if (team === "red") {
            red--;
        } else if (team === "blue") {
            blue--;
        }
        socket.broadcast.emit("removePlayer", {
            id
        })
    })
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});