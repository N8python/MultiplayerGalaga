let socket = io();
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