let socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gameInterval = setInterval(() => {
    ctx.fillText("HELLO WORLD", 100, 100);
})