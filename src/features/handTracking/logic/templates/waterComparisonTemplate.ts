/*
    appleAddTemplate.ts -> 사과덧셈 템플릿 (회전 반영)
    - handleHandActions 대신 handleHandActionsWithRotation 사용.
    - objectsInfo (Obj 타입)에 rotation 초기값을 주고 있다.
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { handleHandActionsWithRotation } from "../../utils/handActionWithRotation";

// 기본 객체 크기
const obj_width = 80;
const obj_height = 80;


export const useWaterComparisonTemplate = ({
    mathProbInfo,
    canvasRef,
    camRatioRef,
    setStep,
    setComment,
    selectAnswer,
    navigate,
}: any) => {
    /* 필요한 객체 */
    const [objects, setObjects] = useState(
        getAdditionTemplateObjects(
            // 덧셈 템플릿에 필요한 객체 가져오기
            mathProbInfo.entityList[0] ?? null, // 왼쪽 엔티티들
            mathProbInfo.entityList[1] ?? null, // 오른쪽 엔티티들
            0
        )
    );
    const objectsRef = useRef(objects);

    /* 템플릿 로직 */
    // object 변경되면 업데이트
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    

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


        handleHandActionsWithRotation(
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
};

/* 1600 x 900을 기준으로 배치 */
function getAdditionTemplateObjects(
    entity1: probEntityType,
    entity2: probEntityType,
    totalNumber: number
): Obj[] {
    const objectsInfo: Obj[] = [
        // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    // 항상 모든 템플릿을 생성하기 때문에, null로 넘기는 경우가 있을 수 있음
    if (entity1 === null || entity2 === null) return objectsInfo;

    let objImage1 = "/asset/water.png"; // 객체로 넣을 이미지
    let objImage2 = "/asset/water.png"; // 객체로 넣을 이미지
    if (entity1.kind === "apple")
        // 현재는 사과 이미지만 가능
        objImage1 = "/asset/water.png";
    if (entity2.kind === "apple")
        // 현재는 사과 이미지만 가능
        objImage2 = "/asset/water.png";


    
    objectsInfo.push({
        id: "water1",
        x: 400,
        y: 600,
        src: objImage1,
        isObj: true, // 객체임
        value: null,
        width: 170,
        height: 210,
        rotation: 0,
    });
    objectsInfo.push({
        id: "water2",
        x: 1000,
        y: 600,
        src: objImage2,
        isObj: true, // 객체임
        value: null,
        width: 170,
        height: 210,
        rotation: 0,
    });
    


    // 정답 맞추러 가기 버튼
    objectsInfo.push({
        id: "button-answer",
        x: 1500,
        y: 800,
        src: `/asset/button-1.png`,
        isObj: false, // 객체 아님
        value: 1, // 버튼
        width: obj_width,
        height: obj_height,
        rotation: 0,
    });

    return objectsInfo;
}
