/*
    disappearTemplate.ts - 사라지기 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { movingObj } from "../../types/objectTypes";
import { probEntityType } from "../../types/problemTypes";
import { isInDropZone } from "../../utils/solveProblem";
import { handleHandActions } from "../../utils/handAction";
import { drawDropZone } from "../../utils/draw";

// 기본 객체 크기
const obj_width = 50;
const obj_height = 50;

// [신규] 이동 속도 계수 (0.1 = 매 프레임 10%씩 이동, 1에 가까울수록 빠름)
const MOVE_SPEED = 0.15;
// [신규] 도착으로 간주할 거리 (5px 이내)
const ARRIVAL_THRESHOLD = 5;

export const useDisappearTemplate = ({
  mathProbInfo,
  canvasRef,
  camRatioRef,
  setStep,
  setComment,
  selectAnswer,
  navigate,
}: any) => {
  // 드롭존 좌표
  const dx = 1200;
  const dy = 250;
  const dw = 400;
  const dh = 400;

  /* 필요한 객체 */
  const [objects, setObjects] = useState(
    getDisappearTemplateObjects(
      // 덧셈 템플릿에 필요한 객체 가져오기
      mathProbInfo.entityList[0] ?? null, // 왼쪽 엔티티들
      mathProbInfo.entityList[1] ?? null, // 오른쪽 엔티티들
      0
    )
  );
  const objectsRef = useRef(objects);
  const animationFrameRef = useRef<number | null>(null);

  /* 초기 드롭존 표시 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawDropZone(ctx, camRatioRef.current, dx, dy, dw, dh);
  }, [camRatioRef, canvasRef]);

  /* 템플릿 로직 */

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
            ? { ...obj, src: `/asset/${totalNum}.png` } // 숫자 수정
            : obj // 아니라면 그대로 유지
      )
    );
  }, [totalNum]);

  // 객체 이동 및 제거 애니메이션 루프
  useEffect(() => {
    // object 변경되면 업데이트
    objectsRef.current = objects;

    // 움직여야 할 객체가 있는지 확인
    const needsAnimation = objects.some((obj) => obj.isDisappearing);

    // 움직여야 하는데, 현재 루프가 돌고 있지 않다면 -> 루프 시작!
    if (needsAnimation && !animationFrameRef.current) {
      const animate = () => {
        setObjects((prev) => {
          // 1. 이동 로직
          const movedObjects = prev.map((obj) => {
            if (
              obj.isDisappearing &&
              obj.targetX !== undefined &&
              obj.targetY !== undefined
            ) {
              const dx = obj.targetX - obj.x;
              const dy = obj.targetY - obj.y;

              // Lerp 이동 (부드럽게)
              const newX = obj.x + dx * MOVE_SPEED;
              const newY = obj.y + dy * MOVE_SPEED;

              return { ...obj, x: newX, y: newY };
            }
            return obj;
          });

          // 2. 도착 체크 및 제거 로직
          const nextObjects = movedObjects.filter((obj) => {
            if (obj.isDisappearing) {
              const dist = Math.hypot(
                obj.targetX! - obj.x,
                obj.targetY! - obj.y
              );
              // 도착했으면(거리가 가까우면) 배열에서 제거
              return dist > ARRIVAL_THRESHOLD;
            }
            return true;
          });

          // 다음 프레임 요청 여부 결정
          // (필터링 후에도 여전히 사라지는 중인 객체가 남아있다면 계속 돔)
          const stillNeedAnimation = nextObjects.some(
            (obj) => obj.isDisappearing
          );

          if (stillNeedAnimation) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            animationFrameRef.current = null; // 더 이상 움직일 게 없으면 종료
          }

          return nextObjects;
        });
      };

      // 루프 최초 실행
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [objects]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 rAF 정리
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
    // console.log("totalNum: " + newTotalNum);

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
      navigate,
      objectsRef
    );
  }

  return { objects, onResults };
};

/* 1600 x 900을 기준으로 배치 */
function getDisappearTemplateObjects(
  entity1: probEntityType,
  entity2: probEntityType,
  totalNumber: number
): movingObj[] {
  const objectsInfo: movingObj[] = [
    // 문제 풀이를 위한 객체
    // 처음엔 아무것도 없음
  ];

  // 항상 모든 템플릿을 생성하기 때문에, null로 넘기는 경우가 있을 수 있음
  if (entity1 === null || entity2 === null) return objectsInfo;

  let objImage1 = "/asset/사과.png"; // 객체로 넣을 이미지
  let objImage2 = "/asset/사과.png"; // 객체로 넣을 이미지
  if (entity1.kind === "apple")
    // 현재는 사과 이미지만 가능
    objImage1 = "/asset/사과.png";
  if (entity2.kind === "apple")
    // 현재는 사과 이미지만 가능
    objImage2 = "/asset/사과.png";

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
    src: `/asset/${totalNumber}.png`,
    isObj: false, // 객체 아님. 총합을 나타내는 숫자임
    value: null,
    width: obj_width,
    height: obj_height,
  });

  return objectsInfo;
}
