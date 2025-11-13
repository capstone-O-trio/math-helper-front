/*
    handAction.ts -> 손 관련 액션
*/

import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { getHandState, type HandState } from "./handState";
import { Obj } from "features/handTracking/types/objectTypes";

let movingObjId: string | null = null;
let selectedButtonId: string | null = null;

const DISAPPEAR_TARGET_X = 800;
const DISAPPEAR_TARGET_Y = 300;

//이전 프레임 손상태저장 - 튕기기 제스쳐를 위함
let lastKnownState: {
    [handIndex: number]:{
        state: HandState,
        indexTip: {x:number, y:number},
        pinchPoint: {x:number, y:number},
        timestamp: number //감지 시간
    };
} = {};

const FLICK_VELOCITY_THRESHOLD = 50; // 튕기기 속도 임계값
const FLICK_TIME_THRESHOLD = 150; // 튕기기 시간 임계값 (밀리초)

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
    navigate: (path: string) => void,
    objectsRef?: React.RefObject<Obj[]>,
) {
    const hands = results.multiHandLandmarks || [];
    if (!hands.length) {
        lastKnownState = {}; // 손이 없으면 상태 초기화
        return;
    };

    hands.forEach((lm: any, index: number) => {
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

        // 엄지 끝 좌표 계산 (핀치 위치)
        const handThumb = lm[4];
        const pinch_x = ((handThumb.x + handIndex.x) / 2) * dispW;
        const pinch_y = ((handThumb.y + handIndex.y) / 2) * dispH;

        // 튕기기 제스쳐 감지
        const currentTime = performance.now();
        const lastState = lastKnownState[index]
        let flickToApply: {x: number, y: number} | null = null;

        if (lastState) {
            const timeDiff = currentTime - lastState.timestamp;

            //1. 매우 짧은시간 안에 동작이 일어났는지 확인
            if (timeDiff > 0 && timeDiff < FLICK_TIME_THRESHOLD) {
                //2 상태가 일단은 fist에서 open또는 indexUp로 바뀌었는지 확인
                if((lastState.state === "okay") && (state === "open" || state === "indexUp"))
                    {
                    //3. 검지끝이 임계값 이상으로 빠르게 이동했는지 확인
                    const dist = Math.hypot(index_x - lastState.indexTip.x, index_y - lastState.indexTip.y);
                    if (dist > FLICK_VELOCITY_THRESHOLD){
                        flickToApply = {
                            x: lastState.pinchPoint.x, 
                            y: lastState.pinchPoint.y
                        };
                    }
                }
            }
        }
        // 현재 프레임의 손 상태 저장
        lastKnownState[index] = {
            state: state,
            indexTip: {x: index_x, y: index_y},
            pinchPoint: {x: pinch_x, y: pinch_y}, 
            timestamp: currentTime
        };

        setObjects((prev) => {
            let changed = false;
            let flickedObjectId: string | null = null;

            //1. 튕기기 적용 대상 찾기
            if (flickToApply && objectsRef && objectsRef.current) {
                let minDist = Infinity;
                objectsRef.current.forEach(obj => {
                    if (!obj.isObj) return; 

                    const ox = obj.x * ratio; 
                    const oy = obj.y * ratio; 
                    
                    const distance = Math.hypot(ox - flickToApply!.x, oy - flickToApply!.y);
                    // 튕긴 지점 반경 내 가장 가까운 객체
                    if (distance < minDist && distance < 200 * ratio) { 
                        minDist = distance;
                        flickedObjectId = obj.id;
                    }
                });
            }

            const next = prev.map((obj) => {
                // 2. 튕기기 상태 적용
                if (obj.id === flickedObjectId && flickToApply) {
                    changed = true;
                    movingObjId = null; 
                    return {
                        ...obj,
                        isDisappearing: true,      // 사라지기 시작!
                        targetX: DISAPPEAR_TARGET_X, // 목표 X 설정
                        targetY: DISAPPEAR_TARGET_Y  // 목표 Y 설정
                    };
                }

                // 기존 이동/버튼 로직
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
