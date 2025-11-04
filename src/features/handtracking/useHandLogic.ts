/*
    useHandLogic.ts -> 손 움직임 상태 변화에 따른 상태 업데이트
*/

import { useEffect, useRef, useState } from "react";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { getHandState } from "./handState";
import { useNavigate } from "react-router-dom";
import { getAnswerInfo, getObjectsInfo } from "../../data/objectData";
import { isInDropZone } from "./solveProblem";

let movingObjId: string | null = null; // 현재 손으로 이동중인 객체의 id
let selectButtonId: string | null = null; // 손으로 선택한 버튼의 id

export const useHandLogic = ({ probInfo, webcamRef, canvasRef, setComment, camRatio, setCamRatio }: any) => {
    const navigate = useNavigate();

    const [mode, setMode] = useState<1 | 2>(1); // 1: 문제 풀어보기, 2: 정답 맞추기
    const modeRef = useRef(mode); // 최신 mode

    const [totalNum, setTotalNum] = useState(0); // 드롭존 안 객체의 총 개수
    const totalNumRef = useRef(totalNum); // 드롭존 안 객체의 총 개수

    const [objects, setObjects] = useState(
        getObjectsInfo(
            probInfo.probType, 
            probInfo.entity, 
            probInfo.count1, 
            probInfo.count2,
            0
        ) // mode 1
    );
    const objectsRef = useRef(objects);
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    const camRatioRef = useRef(1);
    useEffect(() => {
        camRatioRef.current = camRatio;
    }, [camRatio]); // 화면 비율 변경되면 업데이트

    const updateRatio = () => {
        const el = canvasRef.current;
        if (!el) return;
        const r = el.clientWidth / 1600; // 기준 1600 좌표 → 화면 px 스케일
        camRatioRef.current = r; // onResults에서 사용할 최신값
        setCamRatio(r); // (옵션) 화면에 그릴 때도 사용
    };

    // mode 변경 시 객체 초기화
    useEffect(() => {
        // 모드에 따라 객체 띄우기 초기화
        // 손으로 잡은/선택한 것 초기화
        movingObjId = null;
        selectButtonId = null;
        
        modeRef.current = mode; // 모드 바뀔 때 갱신
        
        if (mode === 1) {
            setObjects(
            getObjectsInfo(
                probInfo.probType,
                probInfo.entity,
                probInfo.count1,
                probInfo.count2,
                totalNum
            )
            );
        } else {
            setObjects(
                getAnswerInfo(
                    probInfo.problem,
                    probInfo.count1,
                    probInfo.count2,
                    probInfo.answer,
                    probInfo.wrongAnswer
                )
            );
        }
    }, [mode]);

    // 드롭존 안에 객체가 추가되거나 빠질수록 총합 숫자 업데이트
    useEffect(() => {
        if (mode === 1) {
            // totalNum이 바뀔 때 숫자 이미지 업데이트
            setObjects(prev =>
                prev.map(obj =>
                obj.id === "totalNumber" // 이 객체가 드롭존 안의 객체를 나타내기 위한 숫자 객체라면
                    ? { ...obj, src: `/asset/${totalNum}.png` } // 숫자 수정
                    : obj // 아니라면 그대로 유지
                )
            );
        }
    }, [totalNum]);

    // Mediapipe 결과 처리
    function onResults(results: any) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
        if (!ctx) return;
    
        const dispW = canvas.clientWidth; // = CSS로 보이는 가로
        const dispH = canvas.clientHeight; // = CSS로 보이는 세로
        const ratio = camRatioRef.current; // 현재 화면 비율
    
        // 그리기 전 초기화: 이전 프레임 지우기
        ctx.save(); // 현재 컨텍스트 상태 스택에 저장
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 전체 캔버스 클리어
    
        // 드롭존 픽셀 좌표
        let dx = 1200 * ratio; // 왼쪽 위 x좌표
        let dy = 250 * ratio; // 왼쪽 위 y좌표
        let dw = 400 * ratio; // 가로 길이
        let dh = 400 * ratio; // 세로 길이
        if (modeRef.current === 2) {
            // mode가 바뀌면 드롭존 위치 수정
            dx = 1100 * ratio;
            dy = 100 * ratio;
        }
    
        // 드롭존 그리기
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 6]);
        ctx.strokeStyle = "rgba(20,160,60,0.95)";
        ctx.strokeRect(dx, dy, dw, dh);
    
        // 드롭존 안에 선택지가 있는지 확인
        if (mode == 1) { // 문제 풀어보기
            let newTotalNum = 0; // 객체의 총 개수
            objectsRef.current.forEach(({ id, x, y, src, isObj, value }) => {
                const ox = x * ratio;
                const oy = y * ratio;
                if (isInDropZone(dx,dy,dw,dh,ox,oy,isObj)) {  // 객체가 드롭존 안에 있다면
                newTotalNum++; // 총 개수 하나 증가
                }
            });
            if (newTotalNum !== totalNumRef.current) {
                setTotalNum(newTotalNum);
            }
            totalNumRef.current = newTotalNum;
        }
        // console.log(totalNumRef.current);
    
        let select: null | number = null; // 고른 정답
        if (modeRef.current == 2) { // 문제 맞추기
            // 드롭존 안에 선택지가 있는지 확인
            objectsRef.current.forEach(({ id, x, y, src, isObj, value }) => {
                const ox = x * ratio;
                const oy = y * ratio;
                if (isInDropZone(dx,dy,dw,dh,ox,oy,isObj)) { // 객체가 드롭존 안에 있다면
                    select = value;
                }
            });
            // console.log("mode: " + modeRef.current); // 현재 모드
            // console.log("select: " + select); // 고른 정답
        }
    
        const hands = (results.multiHandLandmarks || []) as Array<
            Array<{ x: number; y: number; z: number }>
        >;
        if (hands.length > 0) {
            // 손이 보이면
            hands.forEach((lm) => {
                // 손 중앙(예: 9번 랜드마크) 좌표 계산
                const handCenter = lm[9];
                const hand_x = handCenter.x * dispW;
                const hand_y = handCenter.y * dispH;
        
                // 검지 끝 좌표 계산
                const handIndex = lm[8];
                const index_x = handIndex.x * dispW;
                const index_y = handIndex.y * dispH;
        
                // 모든 손에 대해 랜드마크/연결선 그리기
                drawConnectors(ctx, lm as any, HAND_CONNECTIONS);
                drawLandmarks(ctx, lm as any);
        
                const state = getHandState(lm); // 손 상태
        
                // 해당 객체와 손이 동일한 위치에 있고, 주먹 쥔 상태라면 이동
                setObjects((prev) =>
                    prev.map(({ id, x, y, src, isObj, value }) => {
                        const ox = x * ratio; // 객체 화면 X
                        const oy = y * ratio; // 객체 화면 Y
                        const th = 50 * ratio; // 히트박스(화면 스케일 반영)
            
                        if (state === "fist") {
                            // 손을 쥔 상태
                            if (
                                // 손과 객체가 근접하면 이동
                                isObj === true && // 객체만 이동 가능
                                hand_x < ox + th &&
                                hand_x > ox - th &&
                                hand_y < oy + th &&
                                hand_y > oy - th &&
                                (movingObjId == null || movingObjId === id) // 객체를 쥐고 있지 않거나, 쥐고 있던 객체였다면
                            ) {
                                movingObjId = id; // 해당 객체를 이동
                                return {
                                id,
                                x: hand_x / ratio,
                                y: hand_y / ratio,
                                src,
                                isObj,
                                value,
                                }; // 위치 갱신
                            }
                        } else if (state === "indexUp") {
                            // 검지만 편 상태
                            if (isObj === false && value === 1) {
                                // 버튼인 경우
                                if (
                                index_x < ox + 70 &&
                                index_x > ox - 70 &&
                                index_y < oy + 70 &&
                                index_y > oy - 70
                                ) {
                                // 버튼 클릭
                                selectButtonId = id;
                                } else {
                                // 버튼 클릭하지 않음
                                if (selectButtonId !== null) {
                                    // 원래 버튼을 누르고 있었다가 뗀 경우
                                    if (selectButtonId === "button-answer") {
                                    // '정답 맞추러 가기' 버튼을 누르다가 뗀 경우
                                    setMode(2); // 모드 변경
                                    }
                                    if (selectButtonId === "button-select") {
                                    // '문제 맞추기' 버튼을 누르다가 뗀 경우
                                    // 정답 확인
                                    if (select !== null) {
                                        if (select === probInfo.answer) {
                                        setComment("정답입니다! 짝짝짝!");
                                        } else {
                                        setComment("오답입니다.. ㅠㅠ");
                                        }
                                    } else {
                                        setComment("선택한 답이 없습니다..!");
                                    }
                                    }
                                    if (selectButtonId === "button-other") {
                                    // '다른 문제 풀러 가기' 버튼을 누르다가 뗀 경우
                                    navigate("/upload");
                                    }
                                }
                                selectButtonId = null; // 버튼 선택 해제
                                }
                            }
                        } else {
                            // 손을 쥐지 않은 상태
                            movingObjId = null; // 객체를 내려놓음
                            selectButtonId = null; // 버튼 선택 해제
                        }

                        return { id, x, y, src, isObj, value }; // 그대로 유지
                    })
                );
            });
        } else {
        }

    ctx.restore();
    }

    useEffect(() => {
        updateRatio();
        const ro = new ResizeObserver(updateRatio);
        if (canvasRef.current) ro.observe(canvasRef.current);
        return () => ro.disconnect();
    }, []);

    return { objects, camRatio, mode, onResults };
};