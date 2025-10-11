import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { getHandState } from "../utils/handState";

import { getObjectsInfo, getAnswerInfo, Obj } from "../data/objectData";
import { probInfoType } from "../type/type";
import { useNavigate } from "react-router-dom";
import { useCheckAnswer } from "../Hook/useCheckAnswer";

let movingObjId: string | null = null; // 현재 손으로 이동중인 객체의 id
let selectButtonId: string | null = null; // 손으로 선택한 버튼의 id

// 문제 정보 저장
/*let probType: string = "addition";
let problem: string = "3+5";
let entity: string = "apple";
let count1: number = 3;
let count2: number = 5;
let answer: number = 8;
let wrongAnswer: number[] = [6, 9];*/

export const HandTracker = (probInfo: probInfoType) => {
  const navigate = useNavigate();

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [objects, setObjects] = useState<Obj[]>(
    getObjectsInfo(
      probInfo.probType,
      probInfo.entity,
      probInfo.count1,
      probInfo.count2
    ) // mode 1
    // getAnswerInfo(problem,  probInfo.count1, probInfo.count2, answer, wrongAnswer) // mode 2
  );
  const objectsRef = useRef(objects);
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  const [camRatio, setCamRatio] = useState(1);
  const camRatioRef = useRef(1);
  const updateRatio = () => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.clientWidth / 1600; // 기준 1600 좌표 → 화면 px 스케일
    camRatioRef.current = r; // onResults에서 사용할 최신값
    setCamRatio(r); // (옵션) 화면에 그릴 때도 사용
  };

  const [mode, setMode] = useState<1 | 2>(1); // 1: 문제 풀어보기, 2: 정답 맞추기
  const modeRef = useRef(mode); // 최신 mode

  // Mediapipe 결과 처리
  function onResults(results: any) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
    if (!ctx) return;

    const dispW = canvas.clientWidth; // = CSS로 보이는 가로
    const dispH = canvas.clientHeight; // = CSS로 보이는 세로
    const ratio = camRatioRef.current; // 현재 화면 비율

    // 그리기 전 초기화: 이전 프레임 지우기
    ctx.save(); // 현재 컨텍스트 상태 스택에 저장
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 전체 캔버스 클리어

    // 드롭존 픽셀 좌표
    let dx = 1200 * ratio; // 왼쪽 위 x좌표
    let dy = 250 * ratio; // 왼쪽 위 y좌표
    let dw = 400 * ratio; // 가로 길이
    let dh = 400 * ratio; // 세로 길이
    if (modeRef.current === 2) {
      // mode가 바뀌면 드롭존 위치 수정
      dx = 1100 * ratio;
      dy = 100 * ratio;
    }

    // 드롭존 그리기
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = "rgba(20,160,60,0.95)";
    ctx.strokeRect(dx, dy, dw, dh);

    // 드롭존 안에 선택지가 있는지 확인
    let select: null | number = null; // 고른 정답
    objectsRef.current.forEach(({ id, x, y, src, isObj, value }) => {
      const ox = x * ratio;
      const oy = y * ratio;
      if (
        isObj === true &&
        ox >= dx &&
        ox <= dx + dw &&
        oy >= dy &&
        oy <= dy + dh
      ) {
        select = value;
      }
    });
    //console.log("mode: " + modeRef.current); // 현재 모드
    if (select !== null) console.log("select: " + select); // 고른 정답

    const hands = (results.multiHandLandmarks || []) as Array<
      Array<{ x: number; y: number; z: number }>
    >;
    if (hands.length > 0) {
      // 손이 보이면
      hands.forEach((lm) => {
        // 손 중앙(예: 9번 랜드마크) 좌표 계산
        const handCenter = lm[9];
        const hand_x = handCenter.x * dispW;
        const hand_y = handCenter.y * dispH;

        // 검지 끝 좌표 계산
        const handIndex = lm[8];
        const index_x = handIndex.x * dispW;
        const index_y = handIndex.y * dispH;

        // 모든 손에 대해 랜드마크/연결선 그리기
        drawConnectors(ctx, lm as any, HAND_CONNECTIONS);
        drawLandmarks(ctx, lm as any);

        const state = getHandState(lm); // 손 상태
        // console.log(state, hand_x, hand_y); // 손 상태, 위치 출력
        // console.log(state, index_x, index_y); // 손 상태, 위치 출력
        // console.log(selectButtonId);

        // 해당 객체와 손이 동일한 위치에 있고, 주먹 쥔 상태라면 이동
        setObjects((prev) =>
          prev.map(({ id, x, y, src, isObj, value }) => {
            const ox = x * ratio; // 객체 화면 X
            const oy = y * ratio; // 객체 화면 Y
            const th = 50 * ratio; // 히트박스(화면 스케일 반영)

            if (state === "fist") {
              // 손을 쥔 상태
              if (
                // 손과 객체가 근접하면 이동
                isObj === true && // 객체만 이동 가능
                hand_x < ox + th &&
                hand_x > ox - th &&
                hand_y < oy + th &&
                hand_y > oy - th &&
                (movingObjId == null || movingObjId === id) // 객체를 쥐고 있지 않거나, 쥐고 있던 객체였다면
              ) {
                movingObjId = id; // 해당 객체를 이동
                return {
                  id,
                  x: hand_x / ratio,
                  y: hand_y / ratio,
                  src,
                  isObj,
                  value,
                }; // 위치 갱신
              }
            } else if (state === "indexUp") {
              // 검지만 편 상태
              if (isObj === false && value === 1) {
                // 버튼인 경우
                if (
                  index_x < ox + 70 &&
                  index_x > ox - 70 &&
                  index_y < oy + 70 &&
                  index_y > oy - 70
                ) {
                  // 버튼 클릭
                  selectButtonId = id;
                } else {
                  // 버튼 클릭하지 않음
                  if (selectButtonId !== null) {
                    // 원래 버튼을 누르고 있었다가 뗀 경우
                    if (selectButtonId === "button-answer") {
                      // '정답 맞추러 가기' 버튼을 누르다가 뗀 경우
                      setMode(2); // 모드 변경
                    }
                    if (selectButtonId === "button-select") {
                      // '문제 맞추기' 버튼을 누르다가 뗀 경우
                      // 정답 확인
                      if (select !== null) {
                        if (select === probInfo.answer) {
                          alert("정답입니다!");
                        } else {
                          alert("오답입니다ㅠㅠ");
                        }
                      } else {
                        alert("선택한 답이 없습니다.");
                      }
                    }
                    if (selectButtonId === "button-other") {
                      // '다른 문제 풀러 가기' 버튼을 누르다가 뗀 경우
                      navigate("/upload");
                    }
                  }
                  selectButtonId = null; // 버튼 선택 해제
                }
              }
            } else {
              // 손을 쥐지 않은 상태
              movingObjId = null; // 객체를 내려놓음
              selectButtonId = null; // 버튼 선택 해제
            }
            return { id, x, y, src, isObj, value }; // 그대로 유지
          })
        );
      });
    } else {
    }

    ctx.restore();
  }

  // 모드 바뀔 때 객체 재생성
  useEffect(() => {
    // 모드에 따라 객체 띄우기 초기화
    // 손으로 잡은/선택한 것 초기화
    movingObjId = null;
    selectButtonId = null;

    modeRef.current = mode; // 모드 바뀔 때 갱신

    if (mode === 1) {
      setObjects(
        getObjectsInfo(
          probInfo.probType,
          probInfo.entity,
          probInfo.count1,
          probInfo.count2
        )
      );
    } else {
      setObjects(
        getAnswerInfo(
          probInfo.problem,
          probInfo.count1,
          probInfo.count2,
          probInfo.answer,
          probInfo.wrongAnswer
        )
      );
    }
  }, [
    mode,
    probInfo.answer,
    probInfo.count1,
    probInfo.count2,
    probInfo.entity,
    probInfo.probType,
    probInfo.problem,
    probInfo.wrongAnswer,
  ]);

  // Hands 초기화 + 카메라 시작
  useEffect(() => {
    let camera: any;
    const hands = new Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2, // 최대 추적 손 개수
      modelComplexity: 1, // 0(빠름)~1(기본)~2(정확) — 정확도/속도 트레이드오프
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true, // 셀피 모드 기준
    });

    hands.onResults(onResults);

    // 비율 초기화 + 리사이즈 대응
    updateRatio();
    const ro = new ResizeObserver(updateRatio);
    if (canvasRef.current) ro.observe(canvasRef.current);

    const startWhenReady = () => {
      const video = webcamRef.current?.video as HTMLVideoElement | undefined;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // 캔버스 해상도를 비디오에 맞춤
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      updateRatio(); // 시작 시 비율 동기화

      // Camera 유틸 시작:
      // 매 프레임마다 onFrame이 호출되고, hands.send({image: video})로 추론 수행
      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: canvas.width,
        height: canvas.height,
      });
      camera.start();
    };

    // <video>가 재생 가능해지면(메타데이터 로드) startWhenReady 실행
    const video = webcamRef.current?.video as HTMLVideoElement | undefined;
    if (video) {
      if (video.readyState >= 2) {
        startWhenReady();
      } else {
        video.addEventListener("loadeddata", startWhenReady as EventListener, {
          once: true,
        });
      }
    }

    // cleanup: 컴포넌트가 내려갈 때 카메라 루프 정지 + Hands 리소스 해제
    return () => {
      if (camera?.stop) camera.stop();
      hands.close();
      ro.disconnect();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "min(100%, 1280px)" }}>
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%", // 16:9 비율 유지
          transform: "scaleX(1)", // 화면을 반전. 거울 효과
          transformOrigin: "center",
        }}
      >
        {/* react-webcam으로 브라우저 카메라 스트림 표시 */}
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
          videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        />

        {/* 오버레이 캔버스: 랜드마크/뼈대 등을 그리는 레이어 */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* 객체를 화면에 표시 */}
        {objects.map(({ id, x, y, src }) => (
          <img
            key={id}
            src={src}
            alt={id}
            style={{
              position: "absolute",
              left: x * camRatio,
              top: y * camRatio,
              width: 48,
              height: 48,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};
