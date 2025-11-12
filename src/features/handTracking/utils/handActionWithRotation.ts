/*
    handActionWithRotation.ts -> 손 관련 액션 (회전 적용)
*/

import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

import { getHandState } from "./handState";

let movingObjId: string | null = null;
let selectedButtonId: string | null = null;

// 각도 보정: 90도 돌려서 손 방향이랑 맞추는 함수
function mapAngle(rawRad: number): number {
    const offset = -Math.PI / 2;
    return rawRad + offset;
}

function getHandAngleRadians(lm: any): number | null {
    const a = lm[5]; // 검지 밑마디
    const b = lm[17]; // 소지 밑마디
    if (!a || !b) return null;

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.atan2(dy, dx);
}

export function handleHandActionsWithRotation(
    results: any,
    ctx: CanvasRenderingContext2D,
    ratio: number,
    dispW: number,
    dispH: number,
    mathProbInfo: any,
    selectAnswer: null | number,
    setObjects: React.Dispatch<React.SetStateAction<any[]>>,
    setStep: (step: number) => void,
    setComment: (msg: string) => void,
    navigate: (path: string) => void
) {
    const hands = results.multiHandLandmarks || [];
    if (!hands.length) return;

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

        // 현재 손의 회전각 계산
        const angleNow = getHandAngleRadians(lm);

        setObjects((prev) => {
            let changed = false;
            const next = prev.map((obj) => {
                const ox = obj.x * ratio;
                const oy = obj.y * ratio;
                const hitRange = 50 * ratio;

                if (state === "fist") {
                    const isHolding =
                        obj.id === movingObjId ||
                        (
                            obj.isObj === true &&
                            hand_x > ox - hitRange &&
                            hand_x < ox + hitRange &&
                            hand_y > oy - hitRange &&
                            hand_y < oy + hitRange
                        );

                    if (isHolding) {
                        movingObjId = obj.id;

                        const rotation =
                            angleNow != null
                                ? mapAngle(angleNow)
                                : obj.rotation ?? 0;

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
                } else if (state === "indexUp") {
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
                            }
                            selectedButtonId = null;
                        }
                    }
                } else if (state === "open") {
                    // 손을 펴면 객체 놓기
                    if (movingObjId === obj.id) movingObjId = null;
                }

                return obj;
            });
            return changed ? next : prev;
        });
    });
}
