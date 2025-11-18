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

// 나무 드롭존 좌표
const tree_dx = 0;
const tree_dy = 180;
const tree_dw = 600;
const tree_dh = 440;

// 박스 드롭존 좌표
const box_dx = 1000;
const box_dy = 300;
const box_dw = 400;
const box_dh = 400;

export const useAppletakeoutTemplate = ({
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment,
    selectAnswer,
    navigate
}: any) => {

    /* 필요한 객체 */
    const [objects, setObjects] = useState(
        getAppletakeoutTemplateObjects( // 템플릿에 필요한 객체 가져오기
            mathProbInfo.entityList[0] ?? null, // 나무에 있는 엔티티들
            mathProbInfo.entityList[0]?.count ?? 0, // 나무에 있는 객체의 개수
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
        drawDropZone(ctx, camRatioRef.current, tree_dx, tree_dy, tree_dw, tree_dh);
        drawDropZone(ctx, camRatioRef.current, box_dx, box_dy, box_dw, box_dh);
    }, [camRatioRef, canvasRef]);

    /* 템플릿 로직 */
    // object 변경되면 업데이트
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    const [treeTotalNum, setTreeTotalNum] = useState(0); // 드롭존 안 객체의 총 개수
    const treeTotalNumRef = useRef(treeTotalNum); // 드롭존 안 객체의 총 개수

    const [boxTotalNum, setBoxTotalNum] = useState(0); // 드롭존 안 객체의 총 개수
    const boxTotalNumRef = useRef(boxTotalNum); // 드롭존 안 객체의 총 개수

    // totalNum 변경되면 업데이트
    useEffect(() => {
        treeTotalNumRef.current = treeTotalNum;
    }, [treeTotalNum]);
    useEffect(() => {
        boxTotalNumRef.current = boxTotalNum;
    }, [boxTotalNum]);

    // 총합 숫자 변경되면 업데이트
    useEffect(() => {
        treeTotalNumRef.current = treeTotalNum;
        boxTotalNumRef.current = boxTotalNum;
        // totalNum이 바뀔 때 숫자 이미지 업데이트
        setObjects(prev =>
            prev.map(obj => {
                if (obj.id === "treeTotalNumber") {
                    return { ...obj, src: `/asset/${treeTotalNum}.png` };
                } else if (obj.id === "boxTotalNumber") {
                    return { ...obj, src: `/asset/${boxTotalNum}.png` };
                } else {
                    return obj; // 아무 조건에도 해당 안 되면 그대로 반환
                }
            })
        );
    }, [treeTotalNum, boxTotalNum]);

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
        drawDropZone(ctx, camRatioRef.current, tree_dx, tree_dy, tree_dw, tree_dh);
        drawDropZone(ctx, camRatioRef.current, box_dx, box_dy, box_dw, box_dh);

        // 드롭존 안 객체가 추가될 때 총합 숫자 변경
        let newTreeTotalNum = 0; // 트리 안 객체의 총 갯수
        let newBoxTotalNum = 0; // 박스 안 객체의 총 갯수
        objectsRef.current.forEach(({
            x, y, isObj
        }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio, tree_dx, tree_dy, tree_dw, tree_dh, ox, oy, isObj)) {  // 객체가 드롭존 안에 있다면
                newTreeTotalNum++; // 총 개수 하나 증가
            }
            else if (isInDropZone(ratio, box_dx, box_dy, box_dw, box_dh, ox, oy, isObj)) {  // 객체가 드롭존 안에 있다면
                newBoxTotalNum++; // 총 개수 하나 증가
            }
        })
        if (newTreeTotalNum !== treeTotalNumRef.current) setTreeTotalNum(newTreeTotalNum)
        else if (newBoxTotalNum !== boxTotalNumRef.current) setBoxTotalNum(newBoxTotalNum);
        treeTotalNumRef.current = newTreeTotalNum;
        boxTotalNumRef.current = newBoxTotalNum;

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
    treeTotalNumber: number,
    boxTotalNumber: number
): Obj[] {

    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    // 항상 모든 템플릿을 생성하기 때문에, null로 넘기는 경우가 있을 수 있음
    if (entity1 === null) return objectsInfo;

    let objImage1 = '/asset/사과.png'; // 객체로 넣을 이미지
    if (entity1.kind === 'apple') // 현재는 사과 이미지만 가능
        objImage1 = '/asset/사과.png';


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

    // 나무 위 객체들 (나무 드롭존 x: 130~510, y: 250~560 범위 내 두줄로 배치)
    // const xMin = tree_dx + obj_width / 2 + 30;
    // const xMax = tree_dx + tree_dw - obj_width / 2 - 30;
    const xMiddle = (tree_dx + tree_dx + tree_dw) / 2;
    const yMiddle = (tree_dy + tree_dy + tree_dh) / 2;
    const yTop = yMiddle - 100;   // 위쪽 행 y좌표
    const yBottom = yMiddle + 40; // 아래쪽 행 y좌표

    const count = entity1.count;
    const half = Math.ceil(count / 2); // 반 나누기
    const xOffset = 100; // 중앙에서 양쪽으로 퍼질 거리 단위

    for (let i = 0; i < count; i++) {
        const isTop = i < half; // 절반까지는 위쪽, 나머지는 아래쪽
        const rowIndex = isTop ? i : i - half; // 각 행 내에서의 인덱스
        const y = isTop ? yTop : yBottom;

        let x;
        if (half === 1) {
            // 하나면 중앙
            x = xMiddle;
        } else {
            const isEven = (half % 2 === 0);
            const midIndex = isEven ? (half / 2 - 0.5) : Math.floor(half / 2);
            const offsetFromCenter = (rowIndex - midIndex) * xOffset;
            x = xMiddle + offsetFromCenter;
        }

        objectsInfo.push({
            id: `left-${i + 1}`,
            x,
            y,
            src: objImage1,
            isObj: true,
            value: null,
            width: obj_width,
            height: obj_height,
        });
    }

    // 나무 아래 객체의 총합을 나타내는 숫자
    objectsInfo.push(
        {
            id: 'treeTotalNumber',
            x: 500,
            y: 800,
            src: `/asset/${treeTotalNumber}.png`,
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
            src: `/asset/${boxTotalNumber}.png`,
            isObj: false, // 객체 아님. 총합을 나타내는 숫자임
            value: null,
            width: 80,
            height: 80,
        }
    );

    return objectsInfo
}