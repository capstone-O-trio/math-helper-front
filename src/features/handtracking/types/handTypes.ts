/*
    handTypes.ts -> 손의 상태 타입 저장
*/

// 손 상태 타입
// 타입 정의
type Landmark = { x: number; y: number; z?: number };
type HandState = 'fist' | 'open' | 'indexUp' | 'unknown';