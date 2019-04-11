/**
 * Creates a ship object, which can draw to the screen
 * @param {{ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement, x: number, y: number, cooldownWait: number}} spec
 */
function Ship({
    ctx,
    canvas,
    x,
    y,
    img,
    cooldownWait
}) {
    let xVel = 0;
    let bullets = [];
    let cooldown = 0;
    return {
        get x() {
            return x;
        },
        get y() {
            return y;
        },
        get cooldownWait() {
            return cooldownWait;
        },
        set x(val) {
            if (typeof val === "number" && Number.isFinite(val)) {
                x = val;
            } else {
                throw new TypeError("Expected Finite Number.");
            }
        },
        set y(val) {
            if (typeof val === "number" && Number.isFinite(val)) {
                y = val;
            } else {
                throw new TypeError("Expected Finite Number.");
            }
        },
        get xVel() {
            return xVel;
        },
        set xVel(val) {
            if (typeof val === "number" && Number.isFinite(val)) {
                xVel = val;
            } else {
                throw new TypeError("Expected Finite Number.");
            }
        },
        move() {
            x += xVel;
            if (x > canvas.width - img.width || x < 0) {
                xVel -= xVel * 2.5;
            }
        },
        draw() {
            ctx.drawImage(img, x, y);
        },
        get bullets() {
            return bullets.map(bullet => ({ x: bullet.x, y: bullet.y }));
        },
        set bullets(arr) {
            if (Array.isArray(arr)) {
                bullets = arr;
            } else {
                throw new TypeError("Expected array.")
            }
        },
        addBullet(spec = {
            canvas,
            ctx,
            x: x + img.width / 2.1,
            y: y - img.height / 5.5,
            color: "red",
            dir: "up"
        }) {
            if (team === "blue") {
                spec.color = "blue";
                spec.dir = "down";
            }
            if (cooldown < 1) {
                bullets.push(Bullet(spec));
                cooldown = cooldownWait;
            }
        },
        iterateBullets() {
            bullets.forEach(bullet => {
                bullet.draw();
                bullet.move();
            });
        },
        reduceCooldown() {
            cooldown -= 1;
        }
    }
}