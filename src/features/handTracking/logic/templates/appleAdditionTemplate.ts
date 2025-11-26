/*
    appleAddTemplate.ts -> 사과덧셈 템플릿
    수정: entityList 구조({entity1: number, entity2: number, object_type: 'apple'}) 반영
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
// import { probEntityType } from "../../types/problemTypes"; // 더 이상 필요하지 않음 (단순 number로 처리)
import { isInDropZone } from "../../utils/solveProblem";
import { HandleHandActions } from "../../utils/HandleHandActions";
import { getButtonObjects } from "../step/useStep1Logic";

// 기본 객체 크기
const obj_width = 80;
const obj_height = 80;

// 드롭존 좌표
const dx = 1150;
const dy = 300;
const dw = 450;
const dh = 350;

const GOAL_IMAGE_X = 1375;
const GOAL_IMAGE_Y = 550;
const GOAL_IMAGE_H = 200;
const GOAL_IMAGE_W = 400;

export const useAppleAdditionTemplate = ({
  entityList, // 변경: mathProbInfo -> entityList
  canvasRef,
  camRatioRef,
  navigate,
}: any) => {
  /* 필요한 객체 */
  // entityList에서 필요한 정보 추출 ({entity1: number, entity2: number, object_type: 'apple'})
  const entity1Count = entityList.entity1 ?? 0;
  const entity2Count = entityList.entity2 ?? 0;
  const objectType = entityList.object_type ?? "apple";

  const baseObjects = getAdditionTemplateObjects(
    entity1Count,
    entity2Count,
    objectType,
    0
  );

  const buttonObjects = getButtonObjects(); // 버튼 불러오기

  const initialObjects: Obj[] = [...baseObjects, ...buttonObjects];

  const [objects, setObjects] = useState<Obj[]>(initialObjects);
  const objectsRef = useRef(objects);

  /* 초기 드롭존 표시 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // drawDropZone(ctx, camRatioRef.current, dx, dy, dw, dh);
  }, [camRatioRef, canvasRef]);

  /* 템플릿 로직 */
  // object 변경되면 업데이트
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  const [totalNum, setTotalNum] = useState(0); // 드롭존 안 객체의 총 개수
  const totalNumRef = useRef(totalNum); // 드롭존 안 객체의 총 개수

  // totalNum 변경되면 업데이트
  useEffect(() => {
    totalNumRef.current = totalNum;
  }, [totalNum]);

  // 총합 숫자 변경되면 업데이트
  useEffect(() => {
    totalNumRef.current = totalNum;
    // totalNum이 바뀔 때 숫자 이미지 업데이트
    setObjects((prev) =>
      prev.map(
        (obj) =>
          obj.id === "totalNumber" // 이 객체가 드롭존 안의 객체를 나타내기 위한 숫자 객체라면
            ? { ...obj, src: `/asset/number/${totalNum}.png` } // 숫자 수정
            : obj // 아니라면 그대로 유지
      )
    );
  }, [totalNum]);

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
    // drawYardDropZone 등의 함수가 필요하다면 여기서 호출 (현재 주석처리됨)
    
    // 드롭존 안 객체가 추가될 때 총합 숫자 변경
    let newTotalNum = 0; // 객체의 총 갯수
    objectsRef.current.forEach(({ x, y, isObj }) => {
      const ox = x;
      const oy = y;
      if (isInDropZone(ratio, dx, dy, dw, dh, ox, oy, isObj)) {
        // 객체가 드롭존 안에 있다면
        newTotalNum++; // 총 개수 하나 증가
      }
    });
    if (newTotalNum !== totalNumRef.current) setTotalNum(newTotalNum);
    totalNumRef.current = newTotalNum;

    HandleHandActions(
      results,
      ctx,
      ratio,
      dispW,
      dispH,
      setObjects,
      navigate
    );
  }

  return { objects, onResults };
};

/* 1600 x 900을 기준으로 배치 */
function getAdditionTemplateObjects(
  count1: number,
  count2: number,
  kind: string,
  totalNumber: number
): Obj[] {
  const objectsInfo: Obj[] = [];

  // 갯수가 유효하지 않으면 빈 배열 반환 가능
  // if (count1 === 0 && count2 === 0) return objectsInfo; 

  let objImage1 = "/asset/apple2.png"; // 기본 이미지
  let objImage2 = "/asset/apple2.png"; // 기본 이미지

  if (kind === "apple") {
    objImage1 = "/asset/apple2.png";
    objImage2 = "/asset/apple2.png";
  }
  // 다른 종류(kind)가 추가될 경우 여기서 분기 처리

  // 배치 기준 (화면 크기 가정)
  const baseY = 450; // 세로 중앙
  const startX = 150; // 첫 번째 그룹 시작 X
  const gapX = 70; // 객체 간 간격
  const groupGap = 250; // 왼쪽/오른쪽 그룹 사이 거리

  // + 기호
  // 위치 계산 시 count1을 직접 사용
  const opX = startX + count1 * gapX + 40;
  objectsInfo.push({
    id: "plus",
    x: opX,
    y: baseY,
    src: "/asset/plus.png",
    isObj: false, // 객체 아님. 기호임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  // = 기호
  // 위치 계산 시 count2를 직접 사용
  objectsInfo.push({
    id: "equal",
    x: opX + groupGap + count2 * gapX + 40,
    y: baseY,
    src: "/asset/equal.png",
    isObj: false, // 객체 아님. 기호임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  objectsInfo.push({
    id: "bowl",
    x: GOAL_IMAGE_X,
    y: GOAL_IMAGE_Y,
    src: "/asset/bowl.png",
    isObj: false,
    value: null,
    width: GOAL_IMAGE_W,
    height: GOAL_IMAGE_H,
  });

  // 왼쪽 객체들
  for (let i = 0; i < count1; i++) {
    objectsInfo.push({
      id: `left-${i + 1}`,
      x: startX + i * gapX,
      y: baseY + (i % 2) * -2 * gapX + gapX,
      src: objImage1,
      isObj: true, // 객체임
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // 오른쪽 객체들
  for (let i = 0; i < count2; i++) {
    objectsInfo.push({
      id: `right-${i + 1}`,
      x: opX + groupGap + i * gapX,
      y: baseY + (i % 2) * -2 * gapX + gapX,
      src: objImage2,
      isObj: true, // 객체임
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // 드롭존 위 객체의 총합을 나타내는 숫자
  objectsInfo.push({
    id: "totalNumber",
    x: 1350,
    y: 330,
    src: `/asset/number/${totalNumber}.png`,
    isObj: false, // 객체 아님. 총합을 나타내는 숫자임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  return objectsInfo;
}