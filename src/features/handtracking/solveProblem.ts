// 객체가 드롭존 안에 있는지 확인
function isInDropZone(
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    ox: number,
    oy: number,
    isObj: boolean
): boolean {
    if (
        isObj === true &&
        ox >= dx &&
        ox <= dx + dw &&
        oy >= dy &&
        oy <= dy + dh
    )   return true;
    else return false;
}

export { isInDropZone }