/*
    HandRenderer.tsx -> 캔버스, 객체, 드롭존 렌더링
*/

export const HandRenderer = ({ objects, camRatio, canvasRef }: any) => (
    <>
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
        {objects.map(({ id, x, y, src, width, height, rotation }: any) =>
            !rotation ? (
                <img
                    key={id}
                    src={src}
                    alt={id}
                    style={{
                        position: "absolute",
                        left: x * camRatio,
                        top: y * camRatio,
                        width: width,
                        height: height,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 3,
                    }}
                />
            ) : (
                <img
                    key={id}
                    src={src}
                    alt={id}
                    style={{
                        position: "absolute",
                        left: x * camRatio,
                        top: y * camRatio,
                        width: width,
                        height: height,
                        transform: `translate(-50%, -50%) rotate(${rotation}rad)`,
                        transformOrigin: "50% 50%",
                        willChange: "transform",
                        pointerEvents: "none",
                        zIndex: 3,
                    }}
                />
            )
        )}
        {objects.map(({ id, x, y, src, width, height }: any) => (
            <img
                key={id}
                src={src}
                alt={id}
                style={{
                    position: "absolute",
                    left: x * camRatio,
                    top: y * camRatio,
                    width: width,
                    height: height,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 3,
                }}
                crossOrigin="anonymous"
            />
        ))}
    </>
);
