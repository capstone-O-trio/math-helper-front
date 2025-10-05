// 타입 정의
type Landmark = { x: number; y: number; z?: number };
type HandState = 'fist' | 'open' | 'unknown';

// 거리 계산
const dist = (a: Landmark, b: Landmark): number => {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.hypot(dx, dy);
};

// 손가락이 접혀있는지 판단(검지, 중지, 약지, 새끼만 가능)
function isCurled(lm: Landmark[], tipIdx: number, pipIdx: number) {
    const wristIdx = 0; // 손바닥 아래
    // tip부터 wristIdx까지의 거리 < pip부터 wristIdx까지의 거리 -> 접힌 걸로 판단
    const disTip = dist(lm[tipIdx], lm[wristIdx]);
    const disPip = dist(lm[pipIdx], lm[wristIdx]);
    return disTip < disPip;
}

// 손 상태 반환: 'fist' | 'open' | 'unknown'
function getHandState(lm: Landmark[]): HandState {
    if (!lm || lm.length < 21) return 'unknown';

    // 검지, 중지, 약지, 새끼가 모두 접혀있다면 주먹 쥔 상태, 아니라면 편 상태
    const curledIndex  = isCurled(lm, 8, 6);   // index(검지): tip 8, pip 6
    const curledMiddle = isCurled(lm, 12, 10); // middle(중지): tip 12, pip 10
    const curledRing   = isCurled(lm, 16, 14); // ring(약지): tip 16, pip 14
    const curledPinky  = isCurled(lm, 20, 18); // pinky(새끼): tip 20, pip 18

    if (curledIndex && curledMiddle && curledRing && curledPinky) {
        return 'fist';
    }
    else {
        return 'open';
    }
}

export { getHandState };