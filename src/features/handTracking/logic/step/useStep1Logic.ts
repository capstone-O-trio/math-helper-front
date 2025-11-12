/*
    useStep1Logic.ts -> step 1: 문제 풀어보기 단계
*/

import { useAdditionTemplate } from "../templates/additionTemplate";
import { useAppletakeoutTemplate } from "../templates/appletakeoutTemplate";
import { useAppleAdditionTemplate } from "../templates/appleAdditionTemplate";

export const useStep1Logic = ({
    stepRef, mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment, selectAnswer, navigate
}: any) => {
    // 모든 템플릿 Hook은 항상 호출
    const addition = useAdditionTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    const appletakeout = useAppletakeoutTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    const appleAddition = useAppleAdditionTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });


    // 필요한 템플릿만 반환 (조건부 반환은 OK)
    if (mathProbInfo.probTemplate === "addition") {
        return addition;
    }
    else if (mathProbInfo.probTemplate === "appletakeout") {
        return appletakeout;
    }
    else if (mathProbInfo.probTemplate === "appleAddition") {
        return appleAddition;
    }

    // 다른 템플릿 대비 기본 반환
    return { objects: [], onResults: () => { } };
}