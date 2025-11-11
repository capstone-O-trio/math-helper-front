/*
    handAction.ts -> 손 관련 액션
*/

import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { getHandState } from "./handState";

let movingObjId: string | null = null;
let selectedButtonId: string | null = null;

export function handleHandActions(
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
        // 모든 손에 대해 랜드마크/연결선 그리기
        drawConnectors(ctx, lm, HAND_CONNECTIONS);
        drawLandmarks(ctx, lm);

        // 손 상태 확인
        const state = getHandState(lm);

        // 손 중앙(예: 9번 랜드마크) 좌표 계산
        const handCenter = lm[9];
        const hand_x = handCenter.x * dispW;
        const hand_y = handCenter.y * dispH;

        // 검지 끝 좌표 계산
        const handIndex = lm[8];
        const index_x = handIndex.x * dispW;
        const index_y = handIndex.y * dispH;

        setObjects((prev) => {
            let changed = false;
            const next = prev.map((obj) => {
                const ox = obj.x * ratio; // 객체 화면 X
                const oy = obj.y * ratio; // 객체 화면 Y
                const hitRange = 50 * ratio; // 히트박스

                if (state === "fist") { // 손을 쥔 상태 ✊
                    if (
                        // 손과 객체가 근접하면 이동
                        obj.isObj === true && // 객체만 이동 가능
                        hand_x > ox - hitRange &&
                        hand_x < ox + hitRange &&
                        hand_y > oy - hitRange &&
                        hand_y < oy + hitRange &&
                        (movingObjId === null || movingObjId === obj.id) // 객체를 쥐고 있지 않거나, 쥐고 있던 객체였다면
                    ) {
                        movingObjId = obj.id; // 해당 객체를 이동
                        const nextObj = { ...obj, x: hand_x / ratio, y: hand_y / ratio }; // 위치 갱신
                        if (nextObj.x !== obj.x || nextObj.y !== obj.y) {
                            changed = true;
                            return nextObj;
                        }
                    }
                }
                else if (state === "indexUp") { // 검지만 편 상태 ☝️
                    if (
                        obj.isObj === false &&
                        obj.value === 1
                    ) { // 버튼인 경우
                        if (
                            index_x > ox - hitRange &&
                            index_x < ox + hitRange &&
                            index_y > oy - hitRange &&
                            index_y < oy + hitRange
                        ) { // 버튼 클릭
                            selectedButtonId = obj.id;
                        } else { // 버튼 클릭하지 않음
                            if (selectedButtonId !== null) {
                                // 원래 버튼을 누르고 있었다가 뗀 경우
                                if (selectedButtonId === "button-answer") {
                                    // '정답 맞추러 가기' 버튼을 누르다가 뗀 경우
                                    setStep(2); // 다음 단계로
                                }
                                if (selectedButtonId === "button-select") {
                                    // '문제 맞추기' 버튼을 누르다가 뗀 경우
                                    // 정답 확인
                                    if (selectAnswer !== null) {
                                        if (selectAnswer === mathProbInfo.answer) {
                                            setComment("정답입니다! 짝짝짝!");
                                        } else {
                                            setComment("오답입니다.. ㅠㅠ");
                                        }
                                    } else {
                                        setComment("선택한 답이 없습니다..!");
                                    }
                                }
                                if (selectedButtonId === "button-other") {
                                    // '다른 문제 풀러 가기' 버튼을 누르다가 뗀 경우
                                    navigate("/upload"); // 이동
                                }
                            }
                            selectedButtonId = null; // 버튼 선택 해제
                        }
                    }
                }

                else if (state === "open") { // 손 펴면 놓기 👋
                    if (movingObjId === obj.id)
                        movingObjId = null;
                }
                return obj;
            });
            return changed ? next : prev;
        });
    });
}
