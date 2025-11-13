/*
    useStep1Logic.ts -> step 1: 문제 풀어보기 단계
*/

import { useCompareAppleTemplate } from "features/handTracking/logic/templates/compareAppleTemplate";
import { useDisappearTemplate } from "features/handTracking/logic/templates/disappearTemplate";
import { useAdditionTemplate } from "../templates/additionTemplate";
import { useAppletakeoutTemplate } from "../templates/appletakeoutTemplate";
<<<<<<< HEAD
import { useAppleAdditionTemplate } from "../templates/appleAdditionTemplate";
=======
import { useScaleTemplate } from "../templates/scaleTemplate";
>>>>>>> 6c3e23f6bba4d1440128dd893d9b139453d4a615

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
<<<<<<< HEAD
    const appleAddition = useAppleAdditionTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });

=======
    const scale = useScaleTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    const appleCompare = useCompareAppleTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    const disappear = useDisappearTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
>>>>>>> 6c3e23f6bba4d1440128dd893d9b139453d4a615

    // 필요한 템플릿만 반환 (조건부 반환은 OK)
    if (mathProbInfo.probTemplate === "addition") {
        return addition;
    }
    else if (mathProbInfo.probTemplate === "appletakeout") {
        return appletakeout;
    } 
    else if (mathProbInfo.probTemplate === "scale") {
        return scale;
    }
    else if (mathProbInfo.probTemplate === "compareApple") {
        return appleCompare;
    }
    else if (mathProbInfo.probTemplate === "disappear") {
        return disappear;
    }
    else if (mathProbInfo.probTemplate === "appleAddition") {
        return appleAddition;
    }

    // 다른 템플릿 대비 기본 반환
    return { objects: [], onResults: () => { } };
}