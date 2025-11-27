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
import { Obj, OBJ_RESULT_TYPE } from "features/handTracking/types/objectTypes";
import { useNavigate } from "react-router-dom";

// 버튼 크기
const button_width = 100;
const button_height = 100;

export const useStep1Logic = ({
  templateId,
  entityList,
  canvasRef,
  camRatioRef,
}: any): OBJ_RESULT_TYPE => {
  const navigate = useNavigate();

  // 템플릿 결과
  let templatesResult: OBJ_RESULT_TYPE = {
    objects: [],
    onResults: () => {},
  };

  // 필요한 템플릿만 반환 (조건부 반환은 OK)
  if (templateId === 1) {
    templatesResult = useAppleAdditionTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  } else if (templateId === 2) {
    templatesResult = useCompareAppleTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  } else if (templateId === 8) {
    templatesResult = useAppletakeoutTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  } else if (templateId === 10) {
    templatesResult = useScaleTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  } else if (templateId === 9) {
    templatesResult = useDisappearTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  } else if (templateId === 11) {
    templatesResult = useWaterComparisonTemplate({
      entityList,
      canvasRef,
      camRatioRef,
      navigate,
    });
  }

  return {
    objects: templatesResult.objects, // 템플릿 객체들
    onResults: templatesResult.onResults,
  };
};

export function getButtonObjects(): Obj[] {
  // 버튼 객체
  const objectsInfo: Obj[] = [];

  // 되돌아가기 버튼
  objectsInfo.push({
    id: "button-back",
    x: 100,
    y: 100,
    src: "/asset/button/button-back.png",
    isObj: false, // 객체 아님
    value: 1, // 버튼
    width: button_width,
    height: button_height,
  });

  // 정답 맞추러 가기 버튼
  objectsInfo.push({
    id: "button-next",
    x: 1500,
    y: 100,
    src: "/asset/button/button-check-answer.png",
    isObj: false, // 객체 아님
    value: 1, // 버튼
    width: button_width,
    height: button_height,
  });

  // 제스처 알아보기 버튼
  objectsInfo.push({
    id: "button-gesture-info",
    x: 100,
    y: 800,
    src: `/asset/button/button-gesture-info.png`,
    isObj: false, // 객체 아님
    value: 1, // 버튼
    width: button_width,
    height: button_height,
  });

  return objectsInfo;
}
