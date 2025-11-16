function getWater(o: any): WaterComparision.WaterMeta | null {
    if (!o || !o.water) return null;
    return o.water as WaterComparision.WaterMeta;
}

// 컵 A에서 한 프레임 동안 밖으로 나가는 양 계산
function computeOutflow(cupA: any, dt: number): number {
    const water = getWater(cupA);
    if (!water) return 0;
    if (water.volume <= 0) return 0;

    const tiltStartRad = water.tiltStartRad ?? (20 * Math.PI) / 180;
    const tiltMaxRad = water.tiltMaxRad ?? (80 * Math.PI) / 180;
    const maxFlowPerSec = water.maxFlowPerSec ?? 50;

    const tilt = Math.abs(cupA.rotation ?? 0);
    if (tilt <= tiltStartRad) return 0;

    const tiltClamped = Math.min(tilt, tiltMaxRad);
    const tiltRatio =
        (tiltClamped - tiltStartRad) / (tiltMaxRad - tiltStartRad); // 0~1

    const flowPerSec = maxFlowPerSec * tiltRatio;
    const dV = flowPerSec * dt;

    const poured = Math.min(dV, water.volume);
    water.volume -= poured;
    return poured;
}

// 컵 A에서 물이 떨어지는 시작점 계산
function getPourOriginWorld(cupA: any): { x: number; y: number } {
    const water = getWater(cupA);
    const innerWidth = water?.innerWidth ?? cupA.width;
    const innerHeight = water?.innerHeight ?? cupA.height;

    const left = -innerWidth / 2;
    const right = innerWidth / 2;
    const top = -innerHeight / 2;

    const angle = cupA.rotation ?? 0;
    const localX = angle >= 0 ? right : left;
    const localY = top;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const worldX = cupA.x + localX * cos - localY * sin;
    const worldY = cupA.y + localX * sin + localY * cos;

    return { x: worldX, y: worldY };
}

// 컵 B 입구와 스트림 교차하는지 판단 + 들어가는 양 계산
function transferToCupB(
    cupB: any,
    origin: { x: number; y: number },
    streamLength: number,
    poured: number
): number {
    const water = getWater(cupB);
    if (!water) return 0;
    if (poured <= 0 || water.capacity <= water.volume) return 0;

    const innerWidth = water.innerWidth ?? cupB.width;
    const innerHeight = water.innerHeight ?? cupB.height;

    // 컵 B는 회전 안 한다는 전제
    const leftB = cupB.x - innerWidth / 2;
    const rightB = cupB.x + innerWidth / 2;
    const bottomB = cupB.y + innerHeight / 2;

    const x0 = origin.x;
    const y0 = origin.y;

    // 컵 B 바닥까지만 실제로 흐르는 것으로 제한
    const maxLengthToBottom = bottomB - y0;
    const effectiveLength = Math.min(streamLength, maxLengthToBottom);

    // origin이 이미 바닥보다 아래면 유효 길이 없음
    if (effectiveLength <= 0) return 0;

    // x는 입구 폭 안에 있어야 하고,
    const insideX = x0 >= leftB && x0 <= rightB;

    // y 범위는 "컵 안"을 실제로 통과해야 한다고 보는 조건
    const passesTop = y0 <= bottomB && y0 + effectiveLength >= bottomB;

    if (!insideX || !passesTop) return 0;

    const efficiency = 1.0;
    const receivable = water.capacity - water.volume;
    const received = Math.min(poured * efficiency, receivable);

    water.volume += received;
    return received;
}

// 물이 떨어지는 것을 계산 및 전시
export function applyWaterTransfer(
    objects: any[],
    dt: number,
    onStream?: (info: WaterComparision.StreamInfo) => void
): boolean {
    const waterObjs = objects.filter((o) => o && o.water);
    if (waterObjs.length < 2) {
        onStream?.({ x: 0, y: 0, length: 0, active: false, thickness: 0 });
        return false;
    }

    const cupA: any =
        waterObjs.find((o) => o.water.role === "source") ?? waterObjs[0];
    const cupB: any =
        waterObjs.find((o) => o.water.role === "target") ??
        waterObjs.find((o) => o !== cupA) ??
        waterObjs[1];

    if (!cupA || !cupB || cupA === cupB) {
        onStream?.({ x: 0, y: 0, length: 0, active: false, thickness: 0 });
        return false;
    }

    const poured = computeOutflow(cupA, dt);
    if (poured <= 0) {
        onStream?.({ x: 0, y: 0, length: 0, active: false, thickness: 0 });
        return false;
    }

    const origin = getPourOriginWorld(cupA);

    // 기본 스트림 길이 (충분히 크게)
    const streamLength = 3000;

    // 실제 물 이동 계산 (컵 B에 얼마나 들어갔는지)
    const received = transferToCupB(cupB, origin, streamLength, poured);

    // 렌더용 물줄기 길이
    let visualLength = streamLength;

    if (received > 0) {
        // 컵 B 내부 기준 바닥 y 좌표 계산
        const waterB = getWater(cupB);
        const innerHeightB = waterB?.innerHeight ?? cupB.height;
        const bottomB = cupB.y + innerHeightB / 2;

        // 컵 B 바닥까지만 보이게 클램프
        const maxVisualLength = bottomB - origin.y;
        visualLength = Math.max(0, Math.min(streamLength, maxVisualLength));
    }

    // 흐름량에 비례한 두께 계산
    const waterA = getWater(cupA);
    const maxFlowPerSec = waterA?.maxFlowPerSec ?? 50;

    const flowPerSecApprox = poured / Math.max(dt, 1e-6); // 이번 프레임 유량 근사
    const flowRatio = Math.max(
        0,
        Math.min(1, flowPerSecApprox / maxFlowPerSec)
    ); // 0~1

    const minThickness = 2; // 최소 두께
    const maxThickness = 16; // 최대 두께
    const thickness = minThickness + (maxThickness - minThickness) * flowRatio;

    onStream?.({
        x: origin.x,
        y: origin.y,
        length: visualLength,
        active: visualLength > 0,
        thickness,
    });

    // 물이 떨어졌는지만 전달
    return visualLength > 0;
}
