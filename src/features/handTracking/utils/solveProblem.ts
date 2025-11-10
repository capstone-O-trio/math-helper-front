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

// answer을 포함한 중복 없는 세 개의 숫자 리스트를 반환
export function makeChoicesOptions(answer: number): number[] {
  const choices = new Set<number>();
  choices.add(answer);

  while (choices.size < 3) {
    // ±1~2 범위의 랜덤한 오차 생성
    const offset = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
    const candidate = answer + offset;
    choices.add(candidate);
  }

  return Array.from(choices).sort((a, b) => a - b);
}
