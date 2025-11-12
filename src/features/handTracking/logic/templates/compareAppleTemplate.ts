/*
    사과 객체 비교 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { drawDropZone } from "../../utils/draw";

// 기본 객체 크기
const obj_width = 50;
const obj_height = 50;

// 왼쪽 드롭존 좌표
const left_dx = 0;
const left_dy = 180;
const left_dw = 600;
const left_dh = 440;

// 오른쪽 드롭존 좌표
const right_dx = 1000;
const right_dy = 300;
const right_dw = 400;
const right_dh = 400;

export const useCompareAppleTemplate = ({
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
    getCompareAppleTemplateObjects(
      // 템플릿에 필요한 객체 가져오기
      mathProbInfo.entityList[0], // 왼쪽 엔티티들
      mathProbInfo.entityList[1], // 오른쪽 엔티티들
      mathProbInfo.entityList[0].count,
      mathProbInfo.entityList[1].count
    )
  );
  const objectsRef = useRef(objects);

  /* 초기 드롭존 표시 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawDropZone(ctx, camRatioRef.current, left_dx, left_dy, left_dw, left_dh);
    drawDropZone(
      ctx,
      camRatioRef.current,
      right_dx,
      right_dy,
      right_dw,
      right_dh
    );
  }, [camRatioRef, canvasRef]);

  /* 템플릿 로직 */
  // object 변경되면 업데이트
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  const [leftTotalNum, setLeftTotalNum] = useState(0); // left 드롭존 안 객체의 총 개수
  const leftTotalNumRef = useRef(leftTotalNum); // 드롭존 안 객체의 총 개수

  const [rightTotalNum, setRightTotalNum] = useState(0); // right 드롭존 안 객체의 총 개수
  const rightTotalNumRef = useRef(rightTotalNum); // 드롭존 안 객체의 총 개수

  // totalNum 변경되면 업데이트
  useEffect(() => {
    leftTotalNumRef.current = leftTotalNum;
  }, [leftTotalNum]);
  useEffect(() => {
    rightTotalNumRef.current = rightTotalNum;
  }, [rightTotalNum]);

  // 총합 숫자 변경되면 업데이트
  useEffect(() => {
    leftTotalNumRef.current = leftTotalNum;
    rightTotalNumRef.current = rightTotalNum;
    // totalNum이 바뀔 때 숫자 이미지 업데이트
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === "leftTotalNumber") {
          return { ...obj, src: `/asset/${leftTotalNum}.png` };
        } else if (obj.id === "rightTotalNumber") {
          return { ...obj, src: `/asset/${rightTotalNum}.png` };
        } else {
          return obj; // 아무 조건에도 해당 안 되면 그대로 반환
        }
      })
    );
  }, [leftTotalNum, rightTotalNum]);

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
    drawDropZone(ctx, camRatioRef.current, left_dx, left_dy, left_dw, left_dh);
    drawDropZone(
      ctx,
      camRatioRef.current,
      right_dx,
      right_dy,
      right_dw,
      right_dh
    );

    // 드롭존 안 객체가 추가될 때 총합 숫자 변경
    let newLeftTotalNum = 0; // 왼쪽의 총 갯수
    let newRightTotalNum = 0; // 오른쪽의 총 갯수
    objectsRef.current.forEach(({ x, y, isObj }) => {
      const ox = x;
      const oy = y;
      if (
        isInDropZone(ratio, left_dx, left_dy, left_dw, left_dh, ox, oy, isObj)
      ) {
        newLeftTotalNum++; // 총 개수 하나 증가
      } else if (
        isInDropZone(
          ratio,
          right_dx,
          right_dy,
          right_dw,
          right_dh,
          ox,
          oy,
          isObj
        )
      ) {
        newRightTotalNum++; // 총 개수 하나 증가
      }
    });

    if (newLeftTotalNum !== leftTotalNumRef.current)
      setLeftTotalNum(newLeftTotalNum);
    else if (newRightTotalNum !== rightTotalNumRef.current)
      setRightTotalNum(newRightTotalNum);
    leftTotalNumRef.current = newLeftTotalNum;
    rightTotalNumRef.current = newRightTotalNum;

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
};

/* 1600 x 900을 기준으로 배치 */
function getCompareAppleTemplateObjects(
  entity1: probEntityType,
  entity2: probEntityType,
  leftTotalNum: number,
  rightTotalNum: number
): Obj[] {
  const objectsInfo: Obj[] = [
    // 문제 풀이를 위한 객체
    // 처음엔 아무것도 없음
  ];

  let objImage1 = "/asset/사과.png"; // 객체로 넣을 이미지
  let objImage2 = "/asset/사과.png"; // 객체로 넣을 이미지

  if (entity1.kind === "apple")
    // 현재는 사과 이미지만 가능
    objImage1 = "/asset/사과.png";
  if (entity2.kind === "apple")
    // 현재는 사과 이미지만 가능
    objImage2 = "/asset/사과.png";

  //green house
  objectsInfo.push({
    id: "greenhouse",
    x: 700,
    y: 250,
    src: "/asset/greenhouse.png",
    isObj: false, // 객체 아님
    value: null,
    width: 200,
    height: 200,
  });

  //pink house
  objectsInfo.push({
    id: "pinkhouse",
    x: 900,
    y: 500,
    src: "/asset/pinkhouse.png",
    isObj: false, // 객체 아님
    value: null,
    width: 200,
    height: 200,
  });

  // 배치 기준 (화면 크기 가정)
  const baseY = 450; // 세로 중앙
  const startX = 150; // 첫 번째 그룹 시작 X
  const gapX = 70; // 객체 간 간격
  const groupGap = 250; // 왼쪽/오른쪽 그룹 사이 거리

  // + 기호
  const opX = startX + entity1.count * gapX + 40;
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
  objectsInfo.push({
    id: "equal",
    x: opX + groupGap + entity2.count * gapX + 40,
    y: baseY,
    src: "/asset/equal.png",
    isObj: false, // 객체 아님. 기호임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  // 왼쪽 객체들
  for (let i = 0; i < entity1.count; i++) {
    objectsInfo.push({
      id: `left-${i + 1}`,
      x: startX + i * gapX,
      y: baseY,
      src: objImage1,
      isObj: true, // 객체임
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // 오른쪽 객체들
  for (let i = 0; i < entity2.count; i++) {
    objectsInfo.push({
      id: `right-${i + 1}`,
      x: opX + groupGap + i * gapX,
      y: baseY,
      src: objImage2,
      isObj: true, // 객체임
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

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
  });

  // 드롭존 위 객체의 총합을 나타내는 숫자
  objectsInfo.push({
    id: "totalNumber",
    x: 1300,
    y: 150,
    src: `/asset/${leftTotalNum}.png`,
    isObj: false, // 객체 아님. 총합을 나타내는 숫자임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  return objectsInfo;
}
