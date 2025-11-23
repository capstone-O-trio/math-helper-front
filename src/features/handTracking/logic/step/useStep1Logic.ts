/* eslint-disable react-hooks/rules-of-hooks */
/*
    useStep1Logic.ts -> step 1: 문제 풀어보기 단계
*/

import { useCompareAppleTemplate } from "features/handTracking/logic/templates/compareAppleTemplate";
import { useDisappearTemplate } from "features/handTracking/logic/templates/disappearTemplate";
import { useAdditionTemplate } from "../templates/additionTemplate";
import { useAppletakeoutTemplate } from "../templates/appletakeoutTemplate";
import { useWaterComparisonTemplate } from "../templates/waterComparisonTemplate";
import { useAppleAdditionTemplate } from "../templates/appleAdditionTemplate";
import { useScaleTemplate } from "../templates/scaleTemplate";
import { Obj } from "features/handTracking/types/objectTypes";

// 버튼 크기
const button_width = 100;
const button_height = 100;

export const useStep1Logic = ({
    stepRef, mathProbInfo, canvasRef, camRatioRef,
    setStep, setComment, selectAnswer, navigate
}: any) => {
    // 템플릿 결과
    let templatesResult: { objects: Obj[]; onResults: (r: any) => void } = {
        objects: [],
        onResults: () => { },
    };

    // 필요한 템플릿만 반환 (조건부 반환은 OK)
    if (mathProbInfo.probTemplate === "addition") {
        templatesResult = useAdditionTemplate({
            mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
        });
    }
    else if (mathProbInfo.probTemplate === "appletakeout") {
        return useAppletakeoutTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    } 
    else if (mathProbInfo.probTemplate === "waterComparison") {
        return useWaterComparisonTemplate({
        mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
    });
    } 
    else if (mathProbInfo.probTemplate === "scale") {
        templatesResult = useScaleTemplate({
            mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
        });
    }
    else if (mathProbInfo.probTemplate === "compareApple") {
        templatesResult = useCompareAppleTemplate({
            mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
        });
    }
    else if (mathProbInfo.probTemplate === "disappear") {
        templatesResult = useDisappearTemplate({
            mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
        });
    }
    else if (mathProbInfo.probTemplate === "appleAddition") {
        templatesResult = useAppleAdditionTemplate({
            mathProbInfo, canvasRef, camRatioRef, setStep, setComment, selectAnswer, navigate
        });
    }

    return {
        objects: templatesResult.objects, // 템플릿 객체들
        onResults: templatesResult.onResults
    };
}

export function getButtonObjects(
): Obj[] {

    // 버튼 객체
    const objectsInfo: Obj[] = [];

    // 되돌아가기 버튼
    objectsInfo.push(
        {
            id: 'button-back',
            x: 100,
            y: 100,
            src: '/asset/button/button-back.png',
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: button_width,
            height: button_height,
        }
    );

    // 정답 맞추러 가기 버튼
    objectsInfo.push(
        {
            id: 'button-next',
            x: 1500,
            y: 100,
            src: '/asset/button/button-check-answer.png',
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: button_width,
            height: button_height,
        }
    );

    // 제스처 알아보기 버튼
    objectsInfo.push(
        {
            id: 'button-gesture-info',
            x: 100,
            y: 800,
            src: `/asset/button/button-gesture-info.png`,
            isObj: false, // 객체 아님
            value: 1, // 버튼
            width: button_width,
            height: button_height,
        }
    );

    return objectsInfo
}