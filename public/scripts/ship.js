/**
 * Creates a ship object, which can draw to the screen
 * @param {{ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement, x: number, y: number, cooldownWait: number}} spec
 */
function Ship({
    ctx,
    canvas,
    x,
    y,
    hp,
    img,
    cooldownWait
}) {
    let xVel = 0;
    let bullets = [];
    let cooldown = 0;
    if (!hp) hp = 100;
    let antiTeam = (img === galagaRed) ? "blue" : "red";
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
        get hp() {
            return hp;
        },
        set hp(val) {
            hp = val;
        },
        get antiTeam() {
            return antiTeam;
        },
        reduceHp(val) {
            if (val <= 100 && hp > 1) {
                hp -= val;
            }
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
            ctx.fillStyle = "green";
            ctx.fillRect(x + ((img !== galagaRed) ? 0 : 0), y + ((img === galagaRed) ? img.height * 0.8 : 0), (hp / 100) * img.width, 10)
        },
        get bullets() {
            return bullets.map(bullet => ({ x: bullet.x, y: bullet.y, team: (img === galagaRed) ? "red" : "blue" }));
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
                spec.y = y + img.height;
            }
            if (cooldown < 1) {
                bullets.push(Bullet(spec));
                cooldown = cooldownWait;
            }
        },
        iterateBullets() {
            bullets.forEach((bullet, index) => {
                bullet.draw();
                bullet.move();
                if (bullet.y < 0 || bullet.y > canvas.width) {
                    delete bullets[index];
                }
            });
        },
        reduceCooldown() {
            cooldown -= 1;
        },
        cc(bullets) {
            bullets.forEach(bullet => {
                console.log((bullet.x >= x && bullet.y >= y && bullet.x <= x + img.width &&
                    bullet.y <= y + img.width) ? "yay" : undefined);
                if (bullet.x >= x && bullet.y >= y && bullet.x <= x + img.width &&
                    bullet.y <= y + img.width && bullet.team === antiTeam) {
                    console.log("boom!");
                    this.reduceHp(1);
                }
            });
        }
    }
}