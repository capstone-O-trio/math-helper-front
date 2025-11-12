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