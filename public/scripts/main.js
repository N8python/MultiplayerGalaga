let socket = io();
let id;
let team = "red";
//Client Side Only Stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const galagaRed = document.querySelector("[src=\"/assets/galagaRed.png\"");
const galagaBlue = document.querySelector("[src=\"/assets/galagaBlue.png\"");
const HP = document.getElementById("health");
let playerShip = Ship({
    ctx,
    canvas,
    img: galagaRed,
    x: canvas.width / 2 - galagaRed.width / 2,
    y: canvas.height - galagaRed.height,
    cooldownWait: 15
});
const globalPlayers = {}
const keysPressed = {
    left: false,
    right: false,
    space: false
};
const keyCodes = {
    37: "left",
    39: "right",
    32: "space"
};
let gameState = "play";
let gameInterval = setInterval(() => {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameState === "play") {
        playerShip.draw();
        playerShip.move();
        playerShip.iterateBullets();
        playerShip.reduceCooldown();
        if (keysPressed.left === true) {
            playerShip.xVel -= 1;
        } else if (keysPressed.right === true) {
            playerShip.xVel += 1;
        }
        if (keysPressed.space === true) {
            playerShip.addBullet();
        }
        playerShip.xVel *= 0.9;
        //Some server side stuff mixed in with the client side stuff...
        if (id) {
            socket.emit("playerDataOut", {
                id,
                x: playerShip.x,
                y: playerShip.y,
                hp: playerShip.hp,
                team: team,
                bullets: playerShip.bullets,
                cooldownWait: playerShip.cooldownWait,
            });
        }
        //Server-side rendering
        Object.values(globalPlayers).forEach(player => {
            player.draw();
            player.iterateBullets();
            playerShip.cc(player.bullets);
        });
        HP.style.width = (playerShip.hp * 2) + "px";
        if (playerShip.hp < 2) {
            socket.emit("playerDeath", {
                id,
                team
            })
            gameState = "over"
        }
    } else if (gameState === "over") {
        ctx.fillStyle = "White";
        ctx.textAlign = "center";
        ctx.font = "60px Courier";
        ctx.fillText("YOU GOT BLOWN UP!", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Courier";
        ctx.fillText("It happens to everyone eventually...", canvas.width / 2, canvas.height * 0.6);
        ctx.fillText("Reload the page to play again!", canvas.width / 2, canvas.height * 0.7);
    }
}, 30);

window.addEventListener("keydown", e => {
    keysPressed[keyCodes[e.which]] = true;
});

window.addEventListener("keyup", e => {
    keysPressed[keyCodes[e.which]] = false;
});
//Server side communication
socket.on("connect", () => {
    console.log("Connected to server!");
})

socket.on("playerDataIn", ({
    id,
    x,
    y,
    hp,
    team,
    bullets,
    cooldownWait
}) => {
    if (!globalPlayers[id]) {
        globalPlayers[id] = Ship({
            ctx,
            canvas,
            img: (team === "blue") ? galagaBlue : galagaRed,
            x,
            y,
            hp,
            cooldownWait
        });
        globalPlayers[id].bullets = bullets.filter(bullet => !!bullet).map(bullet => Bullet({
            ctx,
            canvas,
            x: bullet.x,
            y: bullet.y,
            color: (team === "red") ? "red" : "blue",
            dir: (team === "red") ? "up" : "down"
        }));
        globalPlayers[id].alive = true;
    } else {
        globalPlayers[id].x = x;
        globalPlayers[id].y = y;
        globalPlayers[id].hp = hp;
        globalPlayers[id].bullets = bullets.filter(bullet => !!bullet).map(bullet => Bullet({
            ctx,
            canvas,
            x: bullet.x,
            y: bullet.y,
            color: (team === "red") ? "red" : "blue",
            dir: (team === "red") ? "up" : "down"
        }));
        globalPlayers[id].alive = true;
    }
})

socket.on("idSent", data => {
    id = data.id;
    if (data.team === "blue") {
        team = "blue";
        playerShip = Ship({
            ctx,
            canvas,
            img: galagaBlue,
            x: canvas.width / 2 - galagaBlue.width / 2,
            y: 0,
            cooldownWait: 15
        });
    }
});

socket.on("removePlayer", ({
    id
}) => {
    delete globalPlayers[id];
});
let tick = 0;
let garbageInterval = setInterval(() => {
    if (tick % 2 === 0) {
        Object.keys(globalPlayers).forEach(key => {
            globalPlayers[key].alive = false;
        })
    } else {
        Object.keys(globalPlayers).forEach(key => {
            if (globalPlayers[key].alive === false) {
                delete globalPlayers[key];
            }
        });
    }
    tick += 1;
}, 1000);