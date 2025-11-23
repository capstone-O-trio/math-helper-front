import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useRef } from "react";

import { WebCamera } from "../../webcam/WebCamera";
import { WaterComparisonRenderer } from "./WaterComparisonRenderer";
import { useHandLogic } from "../logic/useHandLogic";
import { Heading } from "../../../components/common/Heading";
import { mathProbInfoType } from "../types/problemTypes";

export const WaterComparisonTracker = (mathProbInfo: mathProbInfoType) => {
    const navigate = useNavigate();

    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { camRatio, setCamRatio, comment, step, objects, onResults } =
        useHandLogic({ mathProbInfo, canvasRef, navigate });

    return (
        <div style={{ position: "relative", width: "min(100%, 1280px)" }}>
            <div
                style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    transform: "scaleX(1)",
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
                <WebCamera
                    webcamRef={webcamRef}
                    canvasRef={canvasRef}
                    onResults={onResults}
                    setCamRatio={setCamRatio}
                />
                <WaterComparisonRenderer
                    objects={objects}
                    camRatio={camRatio}
                    canvasRef={canvasRef}
                />
            </div>
        </div>
    );
};

export {}; // 빈 export