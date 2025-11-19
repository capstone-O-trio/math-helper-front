import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

import { getHandState } from "./handState";

let movingObjId: string | null = null;
let selectedButtonId: string | null = null;
let lastAngleRad: number | null = null;

// 단순 각도 보간
function lerpAngle(prev: number, next: number, alpha = 0.25) {
    return prev + (next - prev) * alpha;
}

// cam 각도를 화면 회전 방향에 맞게 보정
function mapAngle(rawRad: number): number {
    const offset = -Math.PI / 2;
    return rawRad + offset;
}

// 손등 방향(손바닥 가로 방향)으로 회전 각 계산
function getHandAngleRadians(lm: any): number | null {
    const a = lm[5]; // index_mcp
    const b = lm[17]; // pinky_mcp
    if (!a || !b) return null;

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.atan2(dy, dx);
}

export function waterComparisonAction(
    results: any,
    ctx: CanvasRenderingContext2D,
    ratio: number,
    dispW: number,
    dispH: number,
    mathProbInfo: any,
    selectAnswer: null | number,
    setObjects: React.Dispatch<
        React.SetStateAction<WaterComparision.SceneObject[]>
    >,
    setStep: (step: number) => void,
    setComment: (msg: string) => void,
    navigate: (path: string) => void
) {
    const hands = results.multiHandLandmarks || [];
    if (!hands.length) {
        // 손이 추적이 끝나면 회전 추적을 초기화하고 싶은 경우에 활성화
        // movingObjId = null;
        // lastAngleRad = null;
        return;
    }

    hands.forEach((lm: any) => {
        drawConnectors(ctx, lm, HAND_CONNECTIONS);
        drawLandmarks(ctx, lm);

        const state = getHandState(lm);

        const handCenter = lm[9];
        const hand_x = handCenter.x * dispW;
        const hand_y = handCenter.y * dispH;

        const handIndex = lm[8];
        const index_x = handIndex.x * dispW;
        const index_y = handIndex.y * dispH;

        const angleNow = getHandAngleRadians(lm);

        setObjects((prev) => {
            let changed = false;
            let extraObj: WaterComparision.SceneObject | null = null;
            const cupB = prev.find((o) => o.kind === "cupB");

            const next = prev.map((obj) => {
                const ox = obj.x * ratio;
                const oy = obj.y * ratio;

                const hitRange = 75 * ratio;

                // 1. 컵 제어
                if (obj.isObj === true && obj.kind === "cupA") {
                    const inRange =
                        hand_x > ox - hitRange &&
                        hand_x < ox + hitRange &&
                        hand_y > oy - hitRange &&
                        hand_y < oy + hitRange;

                    const isHoldingThis = movingObjId === obj.id;

                    if (state === "fist") {
                        // 아직 아무 것도 안 집은 상태에서 범위 안이면 새로 선택
                        if (!movingObjId && inRange) {
                            movingObjId = obj.id;

                            if (angleNow != null) {
                                lastAngleRad = angleNow;
                            } else {
                                lastAngleRad = null;
                            }
                        }

                        // 이 오브젝트를 현재 현재 손이 집고 있는 경우에만 회전 갱신
                        if (movingObjId === obj.id) {
                            let rotation = obj.rotation ?? 0;

                            if (angleNow != null) {
                                if (lastAngleRad == null) {
                                    lastAngleRad = angleNow;
                                } else {
                                    lastAngleRad = lerpAngle(
                                        lastAngleRad,
                                        angleNow,
                                        0.25
                                    );
                                }
                                rotation = mapAngle(lastAngleRad);
                            }

                            const nextObj = {
                                ...obj,
                                x: hand_x / ratio,
                                y: hand_y / ratio,
                                rotation,
                            };

                            if (
                                nextObj.x !== obj.x ||
                                nextObj.y !== obj.y ||
                                nextObj.rotation !== obj.rotation
                            ) {
                                changed = true;
                                return nextObj;
                            }
                        }
                    } else {
                        if (isHoldingThis) {
                            movingObjId = null;
                            lastAngleRad = null;
                        }
                    }
                }

                // 2. 버튼 선택 (잡고 있을 땐 동작 안 함)
                if (state === "indexUp" && movingObjId === null) {
                    // 현재 object X
                    if (obj.isObj === false && obj.value === 1) {
                        if (
                            index_x > ox - hitRange &&
                            index_x < ox + hitRange &&
                            index_y > oy - hitRange &&
                            index_y < oy + hitRange
                        ) {
                            selectedButtonId = obj.id;
                        } else {
                            if (selectedButtonId !== null) {
                                if (selectedButtonId === "button-answer") {
                                    setStep(2);
                                }
                                if (selectedButtonId === "button-select") {
                                    if (selectAnswer !== null) {
                                        if (
                                            selectAnswer === mathProbInfo.answer
                                        ) {
                                            setComment("정답입니다! 짝짝짝!");
                                        } else {
                                            setComment("오답입니다.. ㅠㅠ");
                                        }
                                    } else {
                                        setComment("선택한 답이 없습니다..!");
                                    }
                                }
                                if (selectedButtonId === "button-other") {
                                    navigate("/upload");
                                }
                                if (selectedButtonId === "reset_1") {
                                    const cupB = prev.find(
                                        (obj) => obj.kind === "cupB"
                                    );
                                    if (cupB && cupB.water) {
                                        extraObj = {
                                            id: Date.toString(),
                                            kind: "fillRatio",
                                            src: "",
                                            x: 0,
                                            y: 0,
                                            width: 0,
                                            height: 0,
                                            value:
                                                cupB.water!.volume /
                                                cupB.water!.capacity,
                                        };
                                    }
                                }
                            }
                            selectedButtonId = null;
                        }
                    }
                }

                return obj;
            });
            if (extraObj) {
                changed = true;

                // cupB.volume 초기화
                if (cupB && cupB.water) {
                    cupB.water.volume = 0;
                }

                return [...next, extraObj];
            }

            return changed ? next : prev;
        });
    });
}
