function getWaterFillRatio(obj: any): number {
    if (!obj.water) return 0;
    const { volume, capacity } = obj.water;
    if (!capacity || capacity <= 0) return 0;
    return Math.max(0, Math.min(1, volume / capacity));
}

const CupWithWater = ({ obj, camRatio }: { obj: any; camRatio: number }) => {
    const { x, y, width, height, rotation = 0, water, kind } = obj;
    const fillRatio = getWaterFillRatio(obj);

    const innerWidth = water?.innerWidth ?? width;
    const innerHeight = water?.innerHeight ?? height;

    const displayWidth = innerWidth * camRatio;
    const displayHeight = innerHeight * camRatio;

    const isTargetCup = kind === "cupB";

    return (
        <div
            style={{
                position: "absolute",
                left: x * camRatio,
                top: y * camRatio,
                width: displayWidth,
                height: displayHeight,
                transform: `translate(-50%, -50%) rotate(${rotation}rad)`,
                transformOrigin: "50% 50%",
                pointerEvents: "none",
                zIndex: 3,
            }}
        >
            {/* 컵 컨테이너 */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    pointerEvents: "none",
                }}
            >
                {/* 컵 본체 */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderLeft: "4px solid #d0d0d0",
                        borderRight: "4px solid #d0d0d0",
                        borderBottom: "4px solid #d0d0d0",
                        borderRadius: "0 0 18px 18px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.1)",
                        boxSizing: "border-box",
                    }}
                >
                    {/* 컵 내부 물 */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: "100%",
                            height: `${fillRatio * 100}%`,
                            background: "rgba(80, 160, 255, 0.8)",
                        }}
                    />
                </div>

                {/* 수면 표기 */}
                {isTargetCup && fillRatio > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: `${(1 - fillRatio) * 100}%`,
                            marginTop: -20,
                            left: -46,
                            transform: "translateY(-50%)",
                            color: "#f34848",
                        }}
                    >
                        <span
                            style={{
                                width: 50,
                                display: "flex",
                                justifyContent: "center",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            {Math.floor(fillRatio * 100) +"%"}
                        </span>
                        <div
                            style={{
                                width: 50,
                                height: 4,
                                background: "#f34848",
                                borderRadius: 4,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const WaterComparisonRenderer = ({
    objects,
    camRatio,
    canvasRef,
}: any) => (
    <>
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

        {objects.map((obj: any) => {
            const { id, kind } = obj;

            if (kind === "cupA" || kind === "cupB") {
                return <CupWithWater key={id} obj={obj} camRatio={camRatio} />;
            }
        })}
    </>
);