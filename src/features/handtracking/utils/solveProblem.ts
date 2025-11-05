/*
    solveProblem.ts
*/

// 객체가 드롭존 안에 있는지 확인
export function isInDropZone(
    ratio: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    ox: number,
    oy: number,
    isObj: boolean
): boolean {
    const new_dx = dx * ratio;
    const new_dy = dy * ratio;
    const new_dw = dw * ratio;
    const new_dh = dh * ratio;
    const new_ox = ox * ratio;
    const new_oy = oy * ratio;

    if (
        isObj === true &&
        new_ox >= new_dx &&
        new_ox <= new_dx + new_dw &&
        new_oy >= new_dy &&
        new_oy <= new_dy + new_dh
    )   return true;
    else return false;
}