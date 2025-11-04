/*
    HandTracker.tsx -> 핵심 조립 컴포넌트
*/

import { useRef, useState } from "react";
import { WebCamera } from "../webcam/WebCamera";
import { HandRenderer } from "./HandRenderer";
import { useHandLogic } from "./useHandLogic";
import Webcam from "react-webcam";
import { Heading } from "../../components/common/Heading";
import { probInfoType } from "../../type/type";

export const HandTracker = (probInfo: probInfoType) => {
    const [camRatio, setCamRatio] = useState(1);

    const [comment, setComment] = useState("정답을 네모칸 안에 넣어주세요");

    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { objects, mode, onResults } = useHandLogic({
        probInfo,
        webcamRef,
        canvasRef,
        setComment,
        camRatio,
        setCamRatio
    });

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
            {mode === 2 && (
                <Heading
                    style={{
                        position: "absolute",
                        top: "-40%",
                        zIndex: 10,
                        color: "navy",
                        fontWeight: "bold",
                    }}
                >
                {comment}
                </Heading>
            )}
            <WebCamera webcamRef={webcamRef} canvasRef={canvasRef} onResults={onResults} setCamRatio={setCamRatio} />
            <HandRenderer objects={objects} camRatio={camRatio} canvasRef={canvasRef} />
            </div>
        </div>
  );
};

export {}; // 빈 export