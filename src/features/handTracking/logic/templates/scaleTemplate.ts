/*
    scaleTemplate.ts -> 저울 무게 비교 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { Obj, objWeight } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { drawDropZone } from "../../utils/draw";
import { getButtonObjects } from "../step/useStep1Logic";

// 기본 객체 크기
const obj_width = 100;
const obj_height = 100;
// 기본 객체 위치
const baseY = 200; // 카드들의 y 위치 (위쪽)

// 저울 왼쪽 드롭존 좌표
const left_dx = 230;
let left_dy = 300;
const left_dw = 300;
const left_dh = 300;

// 저울 오른쪽 드롭존 좌표
const right_dx = 1070;
let right_dy = 300;
const right_dw = 300;
const right_dh = 300;

export const useScaleTemplate = ({
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment,
    selectAnswer,
    navigate
}: any) => {

    /* 필요한 객체 */
    const { objectsInfo, objWeightInfo } = getScaleTemplateObjects(mathProbInfo.entityList);
    const baseObjects = objectsInfo; // 템플릿에 필요한 객체 가져오기

    const buttonObjects = getButtonObjects(); // 버튼 불러오기

    const initialObjects: Obj[] = [
        ...baseObjects,
        ...buttonObjects,
    ];

    const [objects, setObjects] = useState<Obj[]>(initialObjects);
    const objectsRef = useRef(objects);

    /* 초기 드롭존 표시 */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawDropZone(ctx, camRatioRef.current, left_dx, left_dy, left_dw, left_dh);
        drawDropZone(ctx, camRatioRef.current, right_dx, right_dy, right_dw, right_dh);
    }, [camRatioRef, canvasRef]);

    /* 템플릿 로직 */
    // object 변경되면 업데이트
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    // 저울 이미지
    const [scaleImage, setScaleImage] = useState(0); // 드롭존 안 객체
    const scareImageRef = useRef(scaleImage); // 드롭존 안 객체

    // 저울 무게 달라지면 업데이트
    useEffect(() => {
        scareImageRef.current = scaleImage;
        const timer = setTimeout(() => {
            // 저울 무게 달라지면 저울 이미지 업데이트
            setObjects(prev =>
                prev.map(obj => {
                    if (obj.id === "scale") {
                        if (scareImageRef.current === -1) { // 왼쪽이 더 무거운 경우
                            left_dy = 400; // 드롭존 위치 조정
                            right_dy = 300; // 반대쪽 복귀
                            return { ...obj, src: '/asset/scale-left.png' };
                        }
                        else if (scareImageRef.current === 1) { // 오른쪽이 더 무거운 경우
                            right_dy = 400; // 드롭존 위치 조정
                            left_dy = 300;  // 반대쪽 복귀
                            return { ...obj, src: '/asset/scale-right.png' };
                        } else { // 왼쪽 오른쪽 무게가 같은 경우
                            left_dy = 300; right_dy = 300; // 드롭존 위치 조정
                            return { ...obj, src: '/asset/scale-equal.png' };
                        }
                    } else if (obj.isObj) {
                        if (scareImageRef.current === -1) {
                            // 왼쪽이 내려감 → 왼쪽 드롭존 객체만 내려감. 오른쪽 객체는 다시 올라옴
                            if (obj.x > left_dx && obj.x < left_dx + left_dw) {
                                return { ...obj, y: left_dy + left_dh / 2 + 80 };
                            }
                            else if (obj.x > right_dx && obj.x < right_dx + right_dw) {
                                return { ...obj, y: right_dy + right_dh / 2 + 80 };
                            }
                        } else if (scareImageRef.current === 1) {
                            // 오른쪽이 내려감 → 오른쪽 드롭존 객체만 내려감. 왼쪽 객체는 다시 올라옴
                            if (obj.x > right_dx && obj.x < right_dx + right_dw) {
                                return { ...obj, y: right_dy + right_dh / 2 + 80 };
                            }
                            else if (obj.x > left_dx && obj.x < left_dx + left_dw) {
                                return { ...obj, y: left_dy + left_dh / 2 + 80 };
                            }
                        } else {
                            // 다시 평형 상태 → 둘 다 원래 위치로 복귀
                            if (
                                (obj.x > left_dx && obj.x < left_dx + left_dw) ||
                                (obj.x > right_dx && obj.x < right_dx + right_dw)
                            ) {
                                return { ...obj, y: baseY }; // 원래 객체 위치로 돌아옴
                            }
                        }
                    }
                    return obj; // 아무 조건에도 해당 안 되면 그대로 반환
                })
            );
        }, 2000);
        // cleanup (다음 업데이트 전에 기존 타이머 제거)
        return () => clearTimeout(timer);
    }, [scaleImage]);

    /* Mediapipe 관련 로직 */
    function onResults(results: any) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dispW = canvas.clientWidth;
        const dispH = canvas.clientHeight;
        const ratio = camRatioRef.current;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 드롭존 다시 그리기
        drawDropZone(ctx, camRatioRef.current, left_dx, left_dy, left_dw, left_dh);
        drawDropZone(ctx, camRatioRef.current, right_dx, right_dy, right_dw, right_dh);

        // 드롭존 안 객체가 추가될 때 추가된 객체 찾기
        let left_weight = 0; // 저울 왼쪽 무게
        let right_weight = 0; // 저울 오른쪽 무게
        objectsRef.current.forEach(({
            id, x, y, isObj,
        }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio, left_dx, left_dy, left_dw, left_dh, ox, oy, isObj)) { // 객체가 드롭존 안에 있다면
                for (const obj_weight of objWeightInfo) {
                    if (obj_weight.kind === id) { // 왼쪽 드롭존 안에 있는 객체의
                        left_weight += obj_weight.weight // 무게 추가
                    }
                }
            }
            else if (isInDropZone(ratio, right_dx, right_dy, right_dw, right_dh, ox, oy, isObj)) { // 객체가 드롭존 안에 있다면
                for (const obj_weight of objWeightInfo) {
                    if (obj_weight.kind === id) { // 왼쪽 드롭존 안에 있는 객체의
                        right_weight += obj_weight.weight // 무게 추가
                    }
                }
            }
        })
        // console.log(left_weight, right_weight);

        // 저울 왼쪽 오른쪽에 객체가 추가된 경우 저울에 반영
        if (left_weight > right_weight) setScaleImage(-1); // 왼쪽이 더 무거운 경우
        else if (left_weight < right_weight) setScaleImage(1); // 오른쪽이 더 무거운 경우
        else setScaleImage(0); // 왼쪽 오른쪽 무게가 같은 경우
        scareImageRef.current = scaleImage;

        handleHandActions(
            results,
            ctx,
            ratio,
            dispW,
            dispH,
            mathProbInfo,
            selectAnswer,
            setObjects,
            setStep,
            setComment,
            navigate
        );
    }

    return { objects, onResults };
}

/* 1600 x 900을 기준으로 배치 */
function getScaleTemplateObjects(
    entityList: probEntityType[]
): { objectsInfo: Obj[]; objWeightInfo: objWeight[] } {

    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];
    const objWeightInfo: objWeight[] = [] // 객체의 무게를 저장

    // 기본 값 설정
    const centerX = 800; // 화면 중앙 (1600 기준)
    const gapX = 250
    // 저울
    objectsInfo.push(
        {
            id: 'scale',
            x: 800,
            y: 700,
            src: '/asset/scale-equal.png',
            isObj: false, // 객체 아님. 저울임
            value: null,
            width: 1000,
            height: 200,
        }
    );

    // 카드 개수
    const card_number = entityList.length;

    // 총 카드 너비 (카드 간격 포함)
    const totalWidth = (card_number - 1) * gapX;

    // 첫 번째 카드의 시작 x 좌표 (중앙 기준 왼쪽으로 절반 이동)
    const startX = centerX - totalWidth / 2;

    // 각 카드 배치
    for (let i = 0; i < card_number; i++) {
        const card = entityList[i];
        objectsInfo.push(
            {
                id: card.kind,
                x: startX + i * gapX,
                y: baseY,
                src: `/asset/scale-card/${card.kind}.png`,
                isObj: true, // 객체임
                value: null,
                width: obj_width,
                height: obj_height,
            }
        );
        if (card.weight) {
            objWeightInfo.push(
                {
                    kind: card.kind,
                    weight: card.weight,
                }
            )
        }
    }

    return { objectsInfo, objWeightInfo }
}