/*
    appletakeoutTemplate.ts -> 사과 빼내기 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { drawDropZone } from "../../utils/draw";

// 기본 객체 크기
const obj_width = 60;
const obj_height = 60;

export const useAppletakeoutTemplate = ({
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment,
    selectAnswer,
    navigate
}: any) => {

    // 드롭존 좌표
    const dx = 1000;
    const dy = 300;
    const dw = 400;
    const dh = 400;

    /* 필요한 객체 */
    const [objects, setObjects] = useState(
        getAppletakeoutTemplateObjects( // 덧셈 템플릿에 필요한 객체 가져오기
            mathProbInfo.entityList[0], // 왼쪽 엔티티들
            mathProbInfo.entityList[1], // 오른쪽 엔티티들
            0
        )
    );
    const objectsRef = useRef(objects);

    /* 초기 드롭존 표시 */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawDropZone(ctx, camRatioRef.current, dx, dy, dw, dh);
    }, [camRatioRef, canvasRef]);

    /* 템플릿 로직 */
    // object 변경되면 업데이트
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    const [totalNum, setTotalNum] = useState(0); // 드롭존 안 객체의 총 개수
    const totalNumRef = useRef(totalNum); // 드롭존 안 객체의 총 개수

    // totalNum 변경되면 업데이트
    useEffect(() => {
        totalNumRef.current = totalNum;
    }, [totalNum]);

    // 총합 숫자 변경되면 업데이트
    useEffect(() => {
        totalNumRef.current = totalNum;
        // totalNum이 바뀔 때 숫자 이미지 업데이트
        setObjects(prev =>
            prev.map(obj =>
                obj.id === "totalNumber" // 이 객체가 드롭존 안의 객체를 나타내기 위한 숫자 객체라면
                    ? { ...obj, src: `/asset/${totalNum}.png` } // 숫자 수정
                    : obj // 아니라면 그대로 유지
            )
        );
    }, [totalNum]);

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
        drawDropZone(ctx, camRatioRef.current, dx, dy, dw, dh);

        // 드롭존 안 객체가 추가될 때 총합 숫자 변경
        let newTotalNum = 0; // 객체의 총 갯수
        objectsRef.current.forEach(({
            x, y, isObj
        }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio, dx, dy, dw, dh, ox, oy, isObj)) {  // 객체가 드롭존 안에 있다면
                newTotalNum++; // 총 개수 하나 증가
            }
        })
        if (newTotalNum !== totalNumRef.current) setTotalNum(newTotalNum);
        totalNumRef.current = newTotalNum;
        // console.log("totalNum: " + newTotalNum);

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
function getAppletakeoutTemplateObjects(
    entity1: probEntityType,
    entity2: probEntityType,
    totalNumber: number
): Obj[] {

    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    let objImage1 = '/asset/사과.png'; // 객체로 넣을 이미지
    if (entity1.kind === 'apple') // 현재는 사과 이미지만 가능
        objImage1 = '/asset/사과.png';

    // 배치 기준 (화면 크기 가정)
    const baseY = 450; // 세로 중앙
    const startX = 150; // 첫 번째 그룹 시작 X
    const gapX = 70; // 객체 간 간격

    // 나무
    objectsInfo.push(
        {
            id: 'tree',
            x: 430,
            y: 460,
            src: '/asset/tree.png',
            isObj: false, // 객체 아님. 배경임
            value: null,
            width: 700,
            height: 700,
        }
    );


    // 박스
    objectsInfo.push(
        {
            id: 'box',
            x: 1200,
            y: 550,
            src: '/asset/box.png',
            isObj: false, // 객체 아님. 배경임
            value: null,
            width: 400,
            height: 400,
        }
    );

    // 나무 위 객체들
    for (let i = 0; i < entity1.count; i++) {
        objectsInfo.push(
            {
                id: `left-${i + 1}`,
                x: startX + i * gapX,
                y: baseY,
                src: objImage1,
                isObj: true, // 객체임
                value: null,
                width: obj_width,
                height: obj_height,
            }
        );
    }

    // 정답 맞추러 가기 버튼
    objectsInfo.push(
        {
            id: 'button-answer',
            x: 1500,
            y: 800,
            src: `/asset/button-1.png`,
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: obj_width,
            height: obj_height,
        }
    );

    // 나무 아래 객체의 총합을 나타내는 숫자
    objectsInfo.push(
        {
            id: 'treeTotalNumber',
            x: 500,
            y: 800,
            src: `/asset/${totalNumber}.png`,
            isObj: false, // 객체 아님. 총합을 나타내는 숫자임
            value: null,
            width: 80,
            height: 80,
        }
    );

    // 박스 위 객체의 총합을 나타내는 숫자
    objectsInfo.push(
        {
            id: 'boxTotalNumber',
            x: 1200,
            y: 200,
            src: `/asset/${totalNumber}.png`,
            isObj: false, // 객체 아님. 총합을 나타내는 숫자임
            value: null,
            width: 80,
            height: 80,
        }
    );

    return objectsInfo
}