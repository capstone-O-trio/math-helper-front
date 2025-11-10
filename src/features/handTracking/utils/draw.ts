/*
    draw.ts
*/

// 드롭존 그리기
export function drawDropZone(
    ctx: CanvasRenderingContext2D, ratio: number,
    dx:number, dy: number, dw: number, dh: number
    ) {
    const new_dx = dx * ratio;
    const new_dy = dy * ratio;
    const new_dw = dw * ratio;
    const new_dh = dh * ratio;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = "rgba(20,160,60,0.95)";
    ctx.strokeRect(new_dx, new_dy, new_dw, new_dh);
}