let socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const galagaRed = document.querySelector("[src=\"/assets/galagaRed.png\"");

const playerShip = Ship({
    ctx,
    img: galagaRed,
    x: canvas.width / 2 - galagaRed.width / 2,
    y: canvas.height - galagaRed.height
})
const keysPressed = {
    left: false,
    right: false
}
let gameInterval = setInterval(() => {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playerShip.draw();
    playerShip.move();
    if (keysPressed.left === true) {
        playerShip.xVel -= 1;
    } else if (keysPressed.right === true) {
        playerShip.xVel += 1;
    }
    playerShip.xVel *= 0.9;
}, 30)

window.addEventListener("keydown", e => {
    if (e.which === 37) {
        keysPressed.left = true;
    } else if (e.which === 39) {
        keysPressed.right = true;
    }
});

window.addEventListener("keyup", e => {
    if (e.which === 37) {
        keysPressed.left = false;
    } else if (e.which === 39) {
        keysPressed.right = false;
    }
});