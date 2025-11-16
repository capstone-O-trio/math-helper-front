import { useEffect, useRef, useState } from "react";

import { applyWaterTransfer } from "features/handTracking/utils/waterComparisonUtils";
import { waterComparisonAction } from "../../utils/waterComparisonAction";

export const useWaterComparisonTemplate = ({
    mathProbInfo,
    canvasRef,
    camRatioRef,
    setStep,
    setComment,
    selectAnswer,
    navigate,
}: any) => {
    const [objects, setObjects] = useState<any[]>(() =>
        createWaterComparisonObjects()
    );

    const objectsRef = useRef(objects);
    const streamRef = useRef<WaterComparision.StreamInfo | null>(null);

    useEffect(() => {
        objectsRef.current = objects;
    }, [objects]);

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

        waterComparisonAction(
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

        // 떨어지는 물 draw.
        const stream = streamRef.current;
        if (stream && stream.active) {
            const sx = stream.x * ratio;
            const sy = stream.y * ratio;
            const sy2 = sy + stream.length * ratio - 7;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx, sy2);
            ctx.lineWidth = stream.thickness;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(80,160,255,0.6)";
            ctx.stroke();
        }

        ctx.restore();
    }

    useEffect(() => {
        let rafId: number;
        let lastTime = performance.now();

        const loop = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            setObjects((prev) => {
                if (!prev || prev.length === 0) return prev;

                const next = prev.map((o: any) => ({
                    ...o,
                    water: o.water ? { ...o.water } : undefined,
                }));

                const changed = applyWaterTransfer(next, dt, (info) => {
                    streamRef.current = info;
                });

                if (!changed) {
                    // 떨어지는 물 없는 상태도 ref에 저장
                    if (!streamRef.current || streamRef.current.active) {
                        streamRef.current = {
                            x: 0,
                            y: 0,
                            length: 0,
                            thickness: 0,
                            active: false,
                        };
                    }
                }

                return changed ? next : prev;
            });

            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return { objects, onResults };
};

// 컵 init.
function createWaterComparisonObjects(): any[] {
    const objects: any[] = [];

    // 컵 A (source)
    objects.push({
        id: "cupA",
        kind: "cupA",
        x: 1100,
        y: 798,
        isObj: true,
        value: null,
        width: 200,
        height: 200,
        rotation: 0,
        water: {
            capacity: 100,
            volume: 90,
            innerWidth: 200,
            innerHeight: 200,
            tiltStartRad: (20 * Math.PI) / 180,
            tiltMaxRad: (80 * Math.PI) / 180,
            maxFlowPerSec: 50,
            role: "source",
        },
    });

    // 컵 B (target)
    objects.push({
        id: "cupB",
        kind: "cupB",
        x: 600,
        y: 698,
        isObj: false,
        value: null,
        width: 400,
        height: 400,
        rotation: 0,
        water: {
            capacity: 400,
            volume: 0,
            innerWidth: 400,
            innerHeight: 400,
            role: "target",
        },
    });

    return objects;
}
