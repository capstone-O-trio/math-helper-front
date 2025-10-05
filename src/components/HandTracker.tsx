import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { getHandState } from '../utils/handState';

export default function HandTracker() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imagePositions, setImagePositions] = useState<{ x: number; y: number }[]>(); // [{x,y}, ...]

  // Mediapipe 결과 처리
  function onResults(results: any) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
    if (!ctx) return;

    const dispW = canvas.clientWidth;   // = CSS로 보이는 가로
    const dispH = canvas.clientHeight;  // = CSS로 보이는 세로

    // 그리기 전 초기화: 이전 프레임 지우기
    ctx.save(); // 현재 컨텍스트 상태 스택에 저장
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 전체 캔버스 클리어

    const hands = (results.multiHandLandmarks || []) as Array<Array<{ x: number; y: number; z: number }>>;
    if (hands.length > 0) { // 손이 보이면
        const positions: { x: number; y: number }[] = [];
        hands.forEach((lm) => {
            // 손 중앙(예: 9번 랜드마크) 좌표 계산
            const handCenter = lm[9];
            const x = handCenter.x * dispW;
            const y = handCenter.y * dispH;
            positions.push({ x, y });
            
            // 모든 손에 대해 랜드마크/연결선 그리기
            drawConnectors(ctx, lm as any, HAND_CONNECTIONS);
            drawLandmarks(ctx, lm as any);

            const state = getHandState(lm); // 손 상태
            console.log(state);
        });
        setImagePositions(positions); // 손마다 이미지 하나씩 띄우기 위해 배열로 저장
        } else {
            setImagePositions([]); // 손 없으면 모두 숨김
        }

    ctx.restore();
  }

  // Hands 초기화 + 카메라 시작
  useEffect(() => {
    let camera: any;
    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2, // 최대 추적 손 개수
      modelComplexity: 1, // 0(빠름)~1(기본)~2(정확) — 정확도/속도 트레이드오프
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: false, // 셀피 모드 기준
    });

    hands.onResults(onResults);

    const startWhenReady = () => {
      const video = webcamRef.current?.video as HTMLVideoElement | undefined;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // 캔버스 해상도를 비디오에 맞춤
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

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
        video.addEventListener('loadeddata', startWhenReady as EventListener, { once: true });
      }
    }

    // cleanup: 컴포넌트가 내려갈 때 카메라 루프 정지 + Hands 리소스 해제
    return () => {
      if (camera?.stop) camera.stop();
      hands.close();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: 'min(100%, 1280px)' }}>
      <div
        style={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 비율 유지
          transform: 'scaleX(-1)',   // 화면을 반전. 거울 효과
          transformOrigin: 'center',
        }}
      >
        {/* react-webcam으로 브라우저 카메라 스트림 표시 */}
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
        />

        {/* 오버레이 캔버스: 랜드마크/뼈대 등을 그리는 레이어 */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* 손이 있을 때만 PNG 이미지 표시.
            좌표는 onResults에서 계산한 '그대로' 사용하면 시각상 정확히 겹침. */}
        {Array.isArray(imagePositions) && imagePositions.map(({ x, y }, i) => (
            <img
            key={i}
            src="/사과.png"
            alt={`hand-${i}`}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 48,
                height: 48,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 3,
            }}
            />
        ))}
      </div>
    </div>
  );
}