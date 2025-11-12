/*
    사과 객체 비교 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { Obj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";

// 기본 객체 크기
const obj_width = 50;
const obj_height = 50;

// 왼쪽 드롭존 좌표
const left_dx = 250;
const left_dy = 320;
const left_dw = 400;
const left_dh = 300;

// 오른쪽 드롭존 좌표
const right_dx = 930;
const right_dy = 320;
const right_dw = 400;
const right_dh = 300;

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
  const [effects, setEffects] = useState<
    { id: string; side: "left" | "right" }[]
  >([]);
  const [appleComment, setAppleComment] = useState("사과를 옮겨봐!"); // 사과 관련 코멘트

  /* 초기 드롭존 표시 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawYardDropZone(
      ctx,
      camRatioRef.current,
      left_dx,
      left_dy,
      left_dw,
      left_dh
    );
    drawYardDropZone(
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
    drawYardDropZone(
      ctx,
      camRatioRef.current,
      left_dx,
      left_dy,
      left_dw,
      left_dh
    );
    drawYardDropZone(
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

    if (newLeftTotalNum !== leftTotalNumRef.current) {
      if (newLeftTotalNum > leftTotalNumRef.current) {
        // effects 배열에 추가
        setEffects((prev) => [
          ...prev,
          { id: Math.random().toString(), side: "left" },
        ]);

        // 1초 후 effects에서 제거
        setTimeout(() => {
          setEffects((prev) => prev.slice(1));
        }, 1000);
      }
      setAppleComment("잘했어! 초록색 집에 사과가 하나 더 들어갔어!");
      setLeftTotalNum(newLeftTotalNum);
    } else if (newRightTotalNum !== rightTotalNumRef.current) {
      if (newRightTotalNum > rightTotalNumRef.current) {
        // effects 배열에 추가
        setEffects((prev) => [
          ...prev,
          { id: Math.random().toString(), side: "right" },
        ]);

        // 1초 후 effects에서 제거
        setTimeout(() => {
          setEffects((prev) => prev.slice(1));
        }, 1000);
      }
      setAppleComment("핑크색 집에 사과가 하나 더 들어갔네!");
      setRightTotalNum(newRightTotalNum);
    }

    // effects 배열을 순회하며 +1 텍스트 그리기
    effects.forEach(({ side }) => {
      if (side === "left") {
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("+1", left_dx - 30, left_dy - 100);
      } else {
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#7D0354";
        ctx.fillText("+1", right_dx + 30, right_dy - 100);
      }
    });
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

function drawYardDropZone(
  ctx: CanvasRenderingContext2D,
  ratio: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const new_dx = dx * ratio;
  const new_dy = dy * ratio;
  const new_dw = dw * ratio;
  const new_dh = dh * ratio;

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(244, 164, 96, 0.4)"; // sandybrown + 50% 투명도

  // 채워진 사각형으로 그리기
  ctx.fillRect(new_dx, new_dy, new_dw, new_dh);
}

function getCompareAppleTemplateObjects(
  entity1: probEntityType,
  entity2: probEntityType,
  leftTotalNum: number,
  rightTotalNum: number
): Obj[] {
  const objectsInfo: Obj[] = [];

  const objImage1 = "/asset/사과.png";
  const objImage2 = "/asset/사과.png";

  //말풍선 객체
  objectsInfo.push({
    id: "speechbubble-applemove",
    x: 400,
    y: 100,
    src: "/asset/talk-applemove.png",
    isObj: false,
    value: null,
    width: 300,
    height: 100,
  });

  // 🌳 초록색 집 (왼쪽)
  objectsInfo.push({
    id: "greenhouse",
    x: 520,
    y: 250,
    src: "/asset/greenhouse.png",
    isObj: false,
    value: null,
    width: 150,
    height: 150,
  });

  // 🏠 핑크색 집 (오른쪽)
  objectsInfo.push({
    id: "pinkhouse",
    x: 1080,
    y: 255,
    src: "/asset/pinkhouse.png",
    isObj: false,
    value: null,
    width: 150,
    height: 150,
  });

  // 왼쪽 사과들 (초기 위치: 왼쪽 yard)
  const leftStartX = 150;
  const leftStartY = 600;
  const gap = 70;

  for (let i = 0; i < entity1.count; i++) {
    objectsInfo.push({
      id: `left-apple-${i + 1}`,
      x: leftStartX + i * gap,
      y: leftStartY,
      src: objImage1,
      isObj: true,
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // 오른쪽 사과들 (초기 위치: 오른쪽 yard)
  const rightStartX = 1000;
  const rightStartY = 600;

  for (let i = 0; i < entity2.count; i++) {
    objectsInfo.push({
      id: `right-apple-${i + 1}`,
      x: rightStartX + i * gap,
      y: rightStartY,
      src: objImage2,
      isObj: true,
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // ⬅왼쪽 총합 숫자 (초록 집 아래)
  objectsInfo.push({
    id: "leftTotalNumber",
    x: 520,
    y: 700,
    src: `/asset/${leftTotalNum}.png`,
    isObj: false,
    value: null,
    width: 80,
    height: 80,
  });

  // 오른쪽 총합 숫자 (핑크 집 아래)
  objectsInfo.push({
    id: "rightTotalNumber",
    x: 1080,
    y: 700,
    src: `/asset/${rightTotalNum}.png`,
    isObj: false,
    value: null,
    width: 80,
    height: 80,
  });

  // 정답 확인 버튼
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

  return objectsInfo;
}
