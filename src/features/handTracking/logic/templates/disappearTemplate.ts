/*
    disappearTemplate.ts - 사라지기 템플릿
*/

import { useEffect, useRef, useState } from "react";
import { movingObj } from "../../types/objectTypes";
import { HandleHandActions } from "../../utils/HandleHandActions";
import { getButtonObjects } from "features/handTracking/logic/step/useStep1Logic";

// Props 인터페이스 정의
interface UseDisappearTemplateProps {
  entityList: { entity1: number; entity_type: string };
  canvasRef: React.RefObject<HTMLCanvasElement>;
  camRatioRef: React.RefObject<number>;
  navigate: (path: string) => void;
}

// 기본 객체 크기
const obj_width = 70;
const obj_height = 70;

// 이동 속도 계수 (0.1 = 매 프레임 10%씩 이동, 1에 가까울수록 빠름)
const MOVE_SPEED = 0.07;
// 도착으로 간주할 거리
const ARRIVAL_THRESHOLD = 1;

export const useDisappearTemplate = ({
  entityList,
  canvasRef,
  camRatioRef,
  navigate,
}: UseDisappearTemplateProps) => {
  const buttonObjects = getButtonObjects(); // 버튼 불러오기
  /* 필요한 객체 */
  const initialNumOfEntity = entityList.entity1;
  const initialObjects: movingObj[] = [
    ...buttonObjects,
    ...getDisappearTemplateObjects(
      // 덧셈 템플릿에 필요한 객체 가져오기
      entityList,
      initialNumOfEntity
    ),
  ];
  const [objects, setObjects] = useState(initialObjects);
  const objectsRef = useRef(objects);

  const animationFrameRef = useRef<number | null>(null);

  /* 템플릿 로직 */
  const [entityCount, setEntitiyCount] = useState(initialNumOfEntity); //  객체의 총 개수

  // objects 변경되면 entityCount 업데이트
  useEffect(() => {
    const currentRealCount = objects.filter((obj) => obj.isObj).length;
    setEntitiyCount((prev) => {
      if (prev !== currentRealCount) {
        return currentRealCount;
      }
      return prev;
    });
  }, [objects]);

  // 숫자 image 업데이트
  useEffect(() => {
    setObjects((prev) =>
      prev.map(
        (obj) =>
          obj.id === "numOfEntity"
            ? { ...obj, src: `/asset/number/${entityCount}.png` }
            : obj // 아니라면 그대로 유지
      )
    );
  }, [entityCount]);

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

              // 도착했으면(거리가 가까우면)
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

    HandleHandActions(
      results,
      ctx,
      ratio,
      dispW,
      dispH,
      setObjects,
      navigate,
      objectsRef
    );
  }

  return { objects, onResults };
};

/* 1600 x 900을 기준으로 배치 */
function getDisappearTemplateObjects(
  entityList: { entity1: number; entity_type: string },
  numOfEntity: number
): movingObj[] {
  const objectsInfo: movingObj[] = [
    // 문제 풀이를 위한 객체
  ];

  if (entityList === null) return objectsInfo;

  let objImage1 = "/asset/사과.png"; // 객체로 넣을 이미지
  if (entityList.entity_type === "apple") objImage1 = "/asset/사과.png";

  //window
  objectsInfo.push({
    id: "window",
    x: 1200,
    y: 350,
    src: "/asset/window.png",
    isObj: false,
    value: null,
    width: 450,
    height: 300,
  });

  //speechbubble
  objectsInfo.push({
    id: "disappear-talk",
    x: 450,
    y: 200,
    src: "/asset/talk_disappear.png",
    isObj: false,
    value: null,
    width: 400,
    height: 180,
  });

  // 객체 배치 계산
  const xMiddle = 400;
  const yMiddle = 650;
  const count = entityList.entity1;
  const half = Math.ceil(count / 2); // 반 나누기
  const xOffset = 120; // 중앙에서 양쪽으로 퍼질 거리 단위

  for (let i = 0; i < count; i++) {
    const isTop = i < half; // 절반까지는 위쪽, 나머지는 아래쪽
    const rowIndex = isTop ? i : i - half; // 각 행 내에서의 인덱스
    const y = isTop ? yMiddle - 100 : yMiddle + 40;

    let x;
    if (half === 1) {
      x = xMiddle;
    } else {
      const isEven = half % 2 === 0;
      const midIndex = isEven ? half / 2 - 0.5 : Math.floor(half / 2);
      const offsetFromCenter = (rowIndex - midIndex) * xOffset;
      x = xMiddle + offsetFromCenter;
    }

    objectsInfo.push({
      id: `left-${i + 1}`,
      x,
      y,
      src: objImage1,
      isObj: true,
      value: null,
      width: obj_width,
      height: obj_height,
    });
  }

  // 객체의 총합을 나타내는 숫자
  objectsInfo.push({
    id: "numOfEntity",
    x: 150,
    y: 400,
    src: `/asset/number/${numOfEntity}.png`,
    isObj: false, // 객체 아님. 총합을 나타내는 숫자임
    value: null,
    width: 80,
    height: 80,
  });

  return objectsInfo;
}
