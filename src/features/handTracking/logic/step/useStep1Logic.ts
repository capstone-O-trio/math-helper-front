/* eslint-disable react-hooks/rules-of-hooks */
/*
    useStep1Logic.ts -> step 1: 문제 풀어보기 단계
*/

import { useCompareAppleTemplate } from "features/handTracking/logic/templates/compareAppleTemplate";
import { useDisappearTemplate } from "features/handTracking/logic/templates/disappearTemplate";
import { useAdditionTemplate } from "../templates/additionTemplate";
import { useAppletakeoutTemplate } from "../templates/appletakeoutTemplate";
import { useScaleTemplate } from "../templates/scaleTemplate";

export const useStep1Logic = ({
    stepRef, mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment, selectAnswer, navigate
}: any) => {
    // 필요한 템플릿만 반환 (조건부 반환은 OK)
    if (mathProbInfo.probTemplate === "addition") {
        return useAdditionTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    }
    else if (mathProbInfo.probTemplate === "appletakeout") {
        return useAppletakeoutTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    } 
    else if (mathProbInfo.probTemplate === "scale") {
        return useScaleTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    }
    else if (mathProbInfo.probTemplate === "compareApple") {
        return useCompareAppleTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    }
    else if (mathProbInfo.probTemplate === "disappear") {
        return useDisappearTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    }

    // 다른 템플릿 대비 기본 반환
    return { objects: [], onResults: () => { } };
}