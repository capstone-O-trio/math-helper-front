/*
    HandTracker.tsx -> 핵심 조립 컴포넌트
*/

import { useRef } from "react";
import { WebCamera } from "../../webcam/WebCamera";
import { HandRenderer } from "./HandRenderer";
import { useHandLogic } from "../logic/useHandLogic";
import Webcam from "react-webcam";
import { Heading } from "../../../components/common/Heading";
import { useNavigate } from "react-router-dom";
import { mathProbInfoType } from "../types/problemTypes";

export const HandTracker = (mathProbInfo: mathProbInfoType) => {
    const navigate = useNavigate();

    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 핵심 로직 훅
    const {
        camRatio,
        setCamRatio,
        comment,
        step,
        objects,
        onResults
    } = useHandLogic({ mathProbInfo, canvasRef, navigate });

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
            {step === 2 && (
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