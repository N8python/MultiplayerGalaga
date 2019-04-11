let socket = io();
let id;
//Client Side Only Stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const galagaRed = document.querySelector("[src=\"/assets/galagaRed.png\"");

const playerShip = Ship({
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
let gameInterval = setInterval(() => {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            bullets: playerShip.bullets,
            cooldownWait: playerShip.cooldownWait
        });
    }
    //Server-side rendering
    Object.values(globalPlayers).forEach(player => {
        player.draw();
        console.log(player.bullets);
        player.iterateBullets();
    })
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
    bullets,
    cooldownWait
}) => {
    console.log(bullets);
    if (!globalPlayers[id]) {
        console.log(bullets);
        globalPlayers[id] = Ship({
            ctx,
            canvas,
            img: galagaRed,
            x,
            y,
            cooldownWait
        });
        globalPlayers[id].bullets = bullets.map(bullet => Bullet({
            ctx,
            canvas,
            x: bullet.x,
            y: bullet.y,
            color: "red",
            dir: "up"
        }));
    } else {
        globalPlayers[id].x = x;
        globalPlayers[id].y = y;
        globalPlayers[id].bullets = bullets.map(bullet => Bullet({
            ctx,
            canvas,
            x: bullet.x,
            y: bullet.y,
            color: "red",
            dir: "up"
        }));
    }
})

socket.on("idSent", data => {
    id = data.id;
});