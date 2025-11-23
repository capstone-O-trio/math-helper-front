function getWaterFillRatio(obj: any): number {
    if (!obj.water) return 0;
    const { volume, capacity } = obj.water;
    if (!capacity || capacity <= 0) return 0;
    return Math.max(0, Math.min(1, volume / capacity));
}

// 색상 생성 함수: 파란색으로 구현됨
function waterColorFromRatio(ratio: number): string {
    const t = Math.max(0, Math.min(1, ratio));

    // 연한 파랑색.
    const start = { r: 0xad, g: 0xd8, b: 0xe6 };

    // 진한 파랑색.
    const end = { r: 0x00, g: 0x00, b: 0x8b };

    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);

    const toHex = (v: number) => v.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const CupWithWater = ({
    obj,
    camRatio,
    deforeFillRatios,
}: {
    obj: any;
    camRatio: number;
    deforeFillRatios?: number[];
}) => {
    const { x, y, width, height, rotation = 0, water, kind } = obj;
    const fillRatio = getWaterFillRatio(obj);

    const innerWidth = water?.innerWidth ?? width;
    const innerHeight = water?.innerHeight ?? height;

    const displayWidth = innerWidth * camRatio;
    const displayHeight = innerHeight * camRatio;

    // 컵 B 인가?
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
                            marginTop: -17,
                            left: -38,
                            transform: "translateY(-50%)",
                            color: "#f34848",
                            zIndex: 101,
                        }}
                    >
                        <span
                            style={{
                                width: 40,
                                display: "flex",
                                justifyContent: "center",
                                fontSize: 20,
                                fontWeight: "bold",
                                marginBottom: -3,
                            }}
                        >
                            {Math.floor(fillRatio * 100)}
                        </span>
                        <div
                            style={{
                                width: 60,
                                height: 4,
                                background: "#f34848",
                                borderRadius: 4,
                            }}
                        />
                    </div>
                )}

                {isTargetCup &&
                    deforeFillRatios &&
                    deforeFillRatios.map((fillRatio, idx) =>
                        fillRatio > 0 ? (
                            <div
                                key={idx}
                                style={{
                                    position: "absolute",
                                    top: `${(1 - fillRatio) * 100}%`,
                                    marginTop: -17,
                                    left: -38,
                                    transform: "translateY(-50%)",
                                    color: waterColorFromRatio(fillRatio),
                                    zIndex: idx,
                                }}
                            >
                                <span
                                    style={{
                                        width: 40,
                                        display: "flex",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginBottom: -3,
                                    }}
                                >
                                    {Math.floor(fillRatio * 100)}
                                </span>
                                <div
                                    style={{
                                        width: 60,
                                        height: 4,
                                        background:
                                            waterColorFromRatio(fillRatio),
                                        borderRadius: 4,
                                    }}
                                />
                            </div>
                        ) : null
                    )}
            </div>
        </div>
    );
};

export const WaterComparisonRenderer = ({
    objects,
    camRatio,
    canvasRef,
}: any) => {
    return (
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
                    return (
                        <CupWithWater
                            key={id}
                            obj={obj}
                            camRatio={camRatio}
                            deforeFillRatios={objects
                                .filter((obj: any) => obj.kind === "fillRatio")
                                .map((obj: any) => obj.value)}
                        />
                    );
                }

                // 11.19: 컵 B 초기화 버튼 디자인 부분
                if (kind === "resetCupB") {
                    return (
                        <div
                            key={id}
                            style={{
                                position: "absolute",
                                left: obj.x * camRatio,
                                top: obj.y * camRatio,
                                width: 150,
                                height: 50,
                                zIndex: 3,
                                transform: "translate(-50%, -50%)",
                                background: "#4AA3FF",
                                borderRadius: "18px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                fontSize: 17,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: "8px",
                            }}
                        >
                            물 높이 저장💧
                        </div>
                    );
                }
            })}
        </>
    );
};
