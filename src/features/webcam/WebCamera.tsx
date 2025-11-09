/*
    WebCamera.tsx -> 웹캠 띄우기, Mediapipe Hands + Camera 초기화 로직
*/

import { useEffect } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export const WebCamera = ({ webcamRef, canvasRef, onResults, setCamRatio }: any) => {
    // Hands 초기화 + 카메라 시작
    useEffect(() => {
        let camera: any;
        const hands = new Hands({
        locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        // Hand 옵션
        hands.setOptions({
            maxNumHands: 2, // 최대 추적 손 개수
            modelComplexity: 1, // 0(빠름)~1(기본)~2(정확) — 정확도/속도 트레이드오프
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            selfieMode: true, // 셀피 모드 기준
        });

        hands.onResults(onResults);

        // 화면 비율 반영
        const updateRatio = () => {
            const el = canvasRef.current;
            if (!el) return;
            const r = el.clientWidth / 1600; // 기준 1600 좌표 → 화면 px 스케일
            setCamRatio(r); // (옵션) 화면에 그릴 때도 사용
        };

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
  }, [canvasRef, onResults, setCamRatio, webcamRef]);

  return (
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
  );
};