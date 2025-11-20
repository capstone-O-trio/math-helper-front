/*
    useStep2Logic.ts -> step 2: 문제 맞추기 단계
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { isInDropZone, makeChoicesOptions } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { probEntityType } from "../../types/problemTypes";
import { drawDropZone } from "../../utils/draw";

// 선택지 카드 크기
const card_width = 120;
const card_height = 170;

// 버튼 크기
const button_width = 100;
const button_height = 100;

export const useStep2Logic = ({
    stepRef,
    mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment,
    selectAnswer, setSelectAnswer, selectAnswerRef,
    navigate
}: any) => {
    // 드롭존 좌표
    const dx = 800; // 왼쪽 위 x좌표
    const dy = 450; // 왼쪽 위 y좌표
    const dw = 500; // 가로 길이
    const dh = 400; // 세로 길이

    /* 필요한 객체 */
    // 정답 + 근접한 오답 2개 생성 후 오름차순 정렬
    const choiceOptions: number[] = makeChoicesOptions(mathProbInfo.answer);

    const [objects, setObjects] = useState(
        getStep2ObjectsInfo( // 정답 맞추기 단계에서 필요한 객체들
            mathProbInfo.image,
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
    }, [camRatioRef, canvasRef]);

    /* 템플릿 로직 */
    // object 변경되면 업데이트
    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

    // selectAnswer 변경되면 업데이트
    useEffect(() => {
        selectAnswerRef.current = selectAnswer;
    }, [selectAnswer, selectAnswerRef]);

    // 고른 정답이 변경되면 업데이트
    useEffect(() => {
        selectAnswerRef.current = selectAnswer;
        // 고른 정답의 정답 여부에 따라 이미지 업데이트
        setObjects(prev =>
            prev.map(obj => {
                // 말풍선 업데이트
                if (obj.id === "mention") {
                    let mention_image = '/asset/check-answer/init-mention.png';
                    if (selectAnswer) {
                        if (selectAnswer === mathProbInfo.answer)
                            mention_image = '/asset/check-answer/correct-mention.png';
                        else
                            mention_image = '/asset/check-answer/incorrect-mention.png';
                    }
                    return {
                        ...obj,
                        src: mention_image
                    };
                }

                // 곰 이미지 업데이트
                if (obj.id === "bear") {
                    let bear_image = '/asset/check-answer/init-bear.png';
                    if (selectAnswer) {
                        if (selectAnswer === mathProbInfo.answer)
                            bear_image = '/asset/check-answer/correct-bear.png';
                        else
                            bear_image = '/asset/check-answer/incorrect-bear.png';
                    }
                    return {
                        ...obj,
                        src: bear_image
                    };
                }

                // 아무 조건에도 해당되지 않으면 그대로 유지
                return obj;
            })
        );
    }, [mathProbInfo.answer, selectAnswer, selectAnswerRef]);

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
        setSelectAnswer(null);
        objectsRef.current.forEach(({ x, y, isObj, value }) => {
            const ox = x;
            const oy = y;
            if (isInDropZone(ratio, dx, dy, dw, dh, ox, oy, isObj)) { // 객체가 드롭존 안에 있다면
                setSelectAnswer(value);
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
    prob_image: string,
    choiceOptions: number[]
): Obj[] {

    const answerInfo: Obj[] = [ // 정답 맞추기 위한 객체
        // 처음엔 아무것도 없음
    ];

    // 다른 문제 풀러가기 버튼
    answerInfo.push(
        {
            id: 'button-home',
            x: 100,
            y: 100,
            src: '/asset/button/button-home.png',
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: button_width,
            height: button_height,
        }
    );

    // 정답인지 확인하기 버튼
    answerInfo.push(
        {
            id: 'button-check-answer',
            x: 1500,
            y: 100,
            src: '/asset/button/button-check-answer.png',
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: button_width,
            height: button_height,
        }
    );

    // 문제 놓을 박스
    answerInfo.push(
        {
            id: 'prob-box',
            x: 800,
            y: 250,
            src: '/asset/check-answer/prob-box.png',
            isObj: false, // 객체 아님
            value: null,
            width: 600,
            height: 300,
        }
    );

    // 문제 사진
    answerInfo.push(
        {
            id: 'prob-image',
            x: 800,
            y: 250,
            src: prob_image,
            isObj: false, // 객체 아님
            value: null,
            width: 580,
            height: 280,
        }
    );

    // 선택지 놓을 드롭박스
    answerInfo.push(
        {
            id: 'select-box',
            x: 1050,
            y: 650,
            src: '/asset/check-answer/select-box.png',
            isObj: false, // 객체 아님
            value: null,
            width: 400,
            height: 300,
        }
    );

    // 말풍선
    answerInfo.push(
        {
            id: 'mention',
            x: 1450,
            y: 350,
            src: '/asset/check-answer/init-mention.png',
            isObj: false, // 객체 아님
            value: null,
            width: 200,
            height: 150,
        }
    );

    // 캐릭터
    answerInfo.push(
        {
            id: 'bear',
            x: 1450,
            y: 650,
            src: '/asset/check-answer/init-bear.png',
            isObj: false, // 객체 아님
            value: null,
            width: 200,
            height: 300,
        }
    );

    const choices: number[] = choiceOptions;
    choices.sort(); // 오름차순으로 정렬

    // 선택지 1
    answerInfo.push(
        {
            id: 'choice1',
            x: 200,
            y: 650,
            src: 'asset/check-answer/card.png',
            isObj: true, // 객체임
            value: choices[0],
            width: card_width,
            height: card_height,
        }
    );

    // 선택지 2
    answerInfo.push(
        {
            id: 'choice2',
            x: 400,
            y: 650,
            src: 'asset/check-answer/card.png',
            isObj: true, // 객체임
            value: choices[1],
            width: card_width,
            height: card_height,
        }
    );

    // 선택지 3
    answerInfo.push(
        {
            id: 'choice3',
            x: 600,
            y: 650,
            src: 'asset/check-answer/card.png',
            isObj: true, // 객체임
            value: choices[2],
            width: card_width,
            height: card_height,
        }
    );

    return answerInfo
}