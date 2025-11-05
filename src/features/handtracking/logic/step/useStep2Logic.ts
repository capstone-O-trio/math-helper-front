/*
    useStep2Logic.ts -> step 2: 문제 맞추기 단계
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { isInDropZone, makeChoicesOptions } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { probEntityType } from "../../types/problemTypes";
import { drawDropZone } from "../../utils/draw";

export const useStep2Logic = ({ 
    stepRef, 
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment, 
    selectAnswer,
    navigate
}: any) => {
    // 드롭존 좌표
    const dx = 1100; // 왼쪽 위 x좌표
    const dy = 100; // 왼쪽 위 y좌표
    const dw = 400; // 가로 길이
    const dh = 400; // 세로 길이

    /* 필요한 객체 */
    // 정답 + 근접한 오답 2개 생성 후 오름차순 정렬
    const choiceOptions: number[] = makeChoicesOptions(mathProbInfo.answer);

    const [objects, setObjects] = useState(
        getStep2ObjectsInfo( // 정답 맞추기 단계에서 필요한 객체들
            mathProbInfo.entityList[0],
            mathProbInfo.entityList[1],
            mathProbInfo.answer,
            choiceOptions
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
    }, []);

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

        // 드롭존 다시 그리기
        drawDropZone(ctx, camRatioRef.current, dx, dy, dw, dh);

        // 드롭존 안에 선택지가 있는지 확인
        objectsRef.current.forEach(({ x, y, isObj, value }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio,dx,dy,dw,dh,ox,oy,isObj)) { // 객체가 드롭존 안에 있다면
                selectAnswer = value;
            }
        });
        // console.log("selectAnswer: " + selectAnswer)

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
export function getStep2ObjectsInfo(
    entity1: probEntityType, 
    entity2: probEntityType,
    answer: number,
    choiceOptions: number[]
) : Obj[] {

    const count1 = entity1.count;
    const count2 = entity2.count;
    
    const answerInfo: Obj[] = [ // 정답 맞추기 위한 객체
    // 처음엔 아무것도 없음
    ];

    // 첫번째 숫자
    answerInfo.push(
        {
            id: 'count1', 
            x: 500, 
            y: 300, 
            src: `/asset/${count1}.png`,
            isObj: false, // 객체 아님
            value: count1,
        }
    );

    // 두번째 숫자
    answerInfo.push(
        {
            id: 'count2', 
            x: 800, 
            y: 300, 
            src: `/asset/${count2}.png`,
            isObj: false, // 객체 아님
            value: count2,
        }
    );

    // + 기호
    answerInfo.push(
        {
            id: 'plus', 
            x: 650, 
            y: 300, 
            src: '/asset/plus.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
        }
    );

    // = 기호
    answerInfo.push(
        { 
            id: 'equal', 
            x: 950, 
            y: 300, 
            src: '/asset/equal.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
        }
    );

    const choices: number[] = choiceOptions;
    choices.sort(); // 오름차순으로 정렬

    // 선택지 1
    answerInfo.push(
        {
            id: 'choice1', 
            x: 500, 
            y: 600, 
            src: `/asset/${choices[0]}.png`,
            isObj: true, // 객체임
            value: choices[0],
        }
    );

    // 선택지 2
    answerInfo.push(
        {
            id: 'choice2', 
            x: 800, 
            y: 600, 
            src: `/asset/${choices[1]}.png`,
            isObj: true, // 객체임
            value: choices[1],
        }
    );

    // 선택지 3
    answerInfo.push(
        {
            id: 'choice3', 
            x: 1100, 
            y: 600, 
            src: `/asset/${choices[2]}.png`,
            isObj: true, // 객체임
            value: choices[2],
        }
    );

    // 다른 문제 풀러가기 버튼
    answerInfo.push(
        {
            id: 'button-other', 
            x: 100, 
            y: 800, 
            src: `/asset/button-2.png`,
            isObj: false, // 객체 아님
            value: 1, // 버튼
        }
    );

    // 문제 맞추기 버튼
    answerInfo.push(
        {
            id: 'button-select', 
            x: 1500, 
            y: 800, 
            src: `/asset/button-3.png`,
            isObj: false, // 객체 아님
            value: 1, // 버튼
        }
    );
    
    return answerInfo
}