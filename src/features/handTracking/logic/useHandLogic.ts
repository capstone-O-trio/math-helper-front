/*
    useHandLogic.ts -> 손 움직임 상태 변화에 따른 상태 업데이트 -> 전체 흐름 제어(step 상태 전환, 공통 관리)
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { useStep1Logic } from "./step/useStep1Logic";
import { useStep2Logic } from "./step/useStep2Logic";

export const useHandLogic = ({
    mathProbInfo, canvasRef, navigate
}: any) => {
    const [step, setStep] = useState<1 | 2>(1); // 1: 문제 풀어보기, 2: 정답 맞추기
    // const [comment, setComment] = useState("정답을 네모칸 안에 넣어주세요");
    const [comment, setComment] = useState();

    const camRatioRef = useRef(1);
    const [camRatio, setCamRatio] = useState(1);
    const stepRef = useRef(step); // 최신 step

    const [selectAnswer, setSelectAnswer] = useState(0); // 고른 정답
    const selectAnswerRef = useRef(selectAnswer);

    // 고른 정답이 변경되면 업데이트
    useEffect(() => {
        selectAnswerRef.current = selectAnswer;
    }, [selectAnswer]);

    const updateRatio = useCallback(() => {
        const el = canvasRef.current;
        if (!el) return;
        const r = el.clientWidth / 1600; // 기준 좌표 -> 실제 px 비율
        camRatioRef.current = r;
        setCamRatio(r);
    }, [canvasRef]);

    useEffect(() => {
        updateRatio();
        const ro = new ResizeObserver(updateRatio);
        if (canvasRef.current) ro.observe(canvasRef.current);
        return () => ro.disconnect();
    }, [canvasRef, updateRatio]);

    useEffect(() => {
        stepRef.current = step;
    }, [step])

    const step1 = useStep1Logic({
        stepRef,
        mathProbInfo,
        canvasRef,
        camRatioRef,
        setStep,
        setComment,
        navigate,
    });

    const step2 = useStep2Logic({
        stepRef,
        mathProbInfo, canvasRef, camRatioRef,
        setStep, setComment,
        selectAnswer, setSelectAnswer, selectAnswerRef,
        navigate
    });

    const active = step === 1 ? step1 : step2;

    return {
        camRatio,
        setCamRatio,
        comment,
        step,
        setStep,
        objects: active?.objects,
        onResults: active?.onResults,
    };
};