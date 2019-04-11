/**
 * Creates a ship object, which can draw to the screen
 * @param {{ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number}} param0 
 */
function Ship({
    ctx,
    x,
    y,
    img
}) {
    let xVel = 0;
    return {
        get x() {
            return x;
        },
        get y() {
            return y;
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
        },
        draw() {
            ctx.drawImage(img, x, y);
        }
    }
}