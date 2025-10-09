// 객체 타입
export type Obj = { id: string; x: number; y: number; src: string };

export function getObjectsInfo(
    probType="addition", 
    entity: string, 
    count1: number, 
    count2: number): Obj[] {
    
    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    let objImage = '/사과.png'; // 객체로 넣을 이미지
    if (entity == 'apple') // 현재는 사과 이미지만 가능
        objImage = '/사과.png';

    objectsInfo.push(
        { id: 'apple-1', x: 200, y: 150, src: objImage }
    );

    return objectsInfo
}