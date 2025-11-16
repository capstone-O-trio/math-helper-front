/*
    objectTypes.ts
*/

// 객체 타입
export type Obj = {

    id: string; x: number; y: number; src: string,
    isObj: boolean, // 객체인지
    value: null | number, // 숫자라면 값이 있음
    width: number, height: number, // 크기
};

// 객체의 무게 저장할 타입
export type objWeight = {
    kind: string;
    weight: number;
}

export type movingObj = {
    id: string; x: number; y: number; src: string,
    isObj: boolean, // 객체인지
    value: null | number, // 숫자라면 값이 있음
    width: number, height: number, // 크기
    isDisappearing?: boolean; // 목표지로 이동(사라짐) 중인가?
    targetX?: number;         // 이동할 목표 X
    targetY?: number;         // 이동할 목표 Y
}

