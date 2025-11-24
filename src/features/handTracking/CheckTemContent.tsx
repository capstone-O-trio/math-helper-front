import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { WebCamera } from "features/webcam/WebCamera";
import { HandRenderer } from "features/handTracking/components/HandRenderer";
import { OBJ_RESULT_TYPE } from "features/handTracking/types/objectTypes";
import { useStep2Logic } from "features/handTracking/logic/step/useStep2Logic";

interface CheckTemContentProps {
  probImage: string;
  answer: string;
  wrongList: string[];
}

export const CheckTemContent = ({
  probImage,
  answer,
  wrongList,
}: CheckTemContentProps) => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const camRatioRef = useRef(1);
  const [camRatio, setCamRatio] = useState(1);

  let objResults: OBJ_RESULT_TYPE = {
    objects: [],
    onResults: () => {},
  };
  const step2Result = useStep2Logic({
    probImage,
    answer,
    wrongList, //string배열, [ wrongAnswer1, wrongAnswer2 ] 인데 wrongAnswer2은 optional
    canvasRef,
    camRatioRef,
  });
  objResults = step2Result;

  const updateRatio = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.clientWidth / 1600; // 기준 좌표 -> 실제 px 비율
    camRatioRef.current = r;
    setCamRatio(r);
  }, [canvasRef]);

  useEffect(() => {
    updateRatio();
    const ro = new ResizeObserver(updateRatio);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [canvasRef, updateRatio]);

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
        <WebCamera
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          onResults={objResults.onResults}
          setCamRatio={setCamRatio}
        />
        <HandRenderer
          objects={objResults.objects}
          camRatio={camRatio}
          canvasRef={canvasRef}
        />
      </div>
    </div>
  );
};
