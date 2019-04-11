/**
 * 
 * @param {{ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, x: number, y: number, color: string, dir: string}} spec 
 */
function Bullet({
    ctx,
    canvas,
    x,
    y,
    color,
    dir
}) {
    return {
        get x() {
            return x;
        },
        get y() {
            return y;
        },
        draw() {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 3, 10);
        },
        move() {
            console.log(dir);
            if (dir === "up") {
                y -= 5;
            } else if (dir === "down") {
                y += 5;
            }
        }
    }
}