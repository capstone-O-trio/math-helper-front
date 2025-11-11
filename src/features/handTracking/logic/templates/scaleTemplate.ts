/*
    scaleTemplate.ts -> 저울 무게 비교 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { drawDropZone } from "../../utils/draw";

// 기본 객체 크기
const obj_width = 100;
const obj_height = 100;

// 저울 왼쪽 드롭존 좌표
const left_dx = 230;
const left_dy = 300;
const left_dw = 300;
const left_dh = 300;

// 저울 오른쪽 드롭존 좌표
const right_dx = 1070;
const right_dy = 300;
const right_dw = 300;
const right_dh = 300;

export const useScaleTemplate = ({
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment,
    selectAnswer,
    navigate
}: any) => {

    /* 필요한 객체 */
    const [objects, setObjects] = useState(
        getScaleTemplateObjects( // 템플릿에 필요한 객체 가져오기
            mathProbInfo.entityList
        )
    );
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
    const [scareImage, setScareImage] = useState(0); // 드롭존 안 객체
    const scareImageRef = useRef(scareImage); // 드롭존 안 객체

    // 저울 왼쪽팔
    const [scareLeftObj, setScareLeftObj] = useState(0); // 드롭존 안 객체
    const scareLeftObjRef = useRef(scareLeftObj); // 드롭존 안 객체

    // 저울 오른쪽팔
    const [scareRightObj, setScareRightObj] = useState(0); // 드롭존 안 객체
    const scareRightObjRef = useRef(scareRightObj); // 드롭존 안 객체

    // totalNum 변경되면 업데이트
    useEffect(() => {
        scareLeftObjRef.current = scareLeftObj;
    }, [scareLeftObj]);
    useEffect(() => {
        scareRightObjRef.current = scareRightObj;
    }, [scareRightObj]);

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

        // 드롭존 안 객체가 추가될 때 총합 숫자 변경
        let newTreeTotalNum = 0; // 트리 안 객체의 총 갯수
        let newBoxTotalNum = 0; // 박스 안 객체의 총 갯수
        objectsRef.current.forEach(({
            x, y, isObj
        }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio, left_dx, left_dy, left_dw, left_dh, ox, oy, isObj)) { // 객체가 드롭존 안에 있다면
                newTreeTotalNum++; // 총 개수 하나 증가
            }
            else if (isInDropZone(ratio, right_dx, right_dy, right_dw, right_dh, ox, oy, isObj)) { // 객체가 드롭존 안에 있다면
                newBoxTotalNum++; // 총 개수 하나 증가
            }
        })
        if (scareLeftObj !== scareLeftObjRef.current) setScareLeftObj(newTreeTotalNum)
        else if (scareRightObj !== scareRightObjRef.current) setScareRightObj(newBoxTotalNum);
        scareLeftObjRef.current = scareLeftObj;
        scareRightObjRef.current = scareRightObj;

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
): Obj[] {

    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    // 기본 값 설정
    const baseY = 200; // 카드들의 y 위치 (위쪽)
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
        console.log(`/asset/scale-card/${card.kind}.png`);
        objectsInfo.push(
            {
                id: `object${i + 1}`,
                x: startX + i * gapX,
                y: baseY,
                src: `/asset/scale-card/${card.kind}.png`,
                isObj: true, // 객체임
                value: null,
                width: obj_width,
                height: obj_height,
            }
        );
    }

    return objectsInfo
}