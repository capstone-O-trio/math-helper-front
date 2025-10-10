// 객체 타입
export type Obj = { 
    id: string; x: number; y: number; src: string, 
    isObj: boolean, // 객체인지
    };

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

    // 배치 기준 (화면 크기 가정)
    const baseY = 200; // 세로 중앙
    const startX = 150; // 첫 번째 그룹 시작 X
    const gapX = 70; // 객체 간 간격
    const groupGap = 250; // 왼쪽/오른쪽 그룹 사이 거리
    
    // + 기호
    const opX = startX + count1 * gapX + 40
    objectsInfo.push(
        {
            id: 'plus', 
            x: opX, 
            y: baseY, 
            src: '/plus.png',
            isObj: false, // 객체 아님. 기호임
        }
    );

    // = 기호
    objectsInfo.push(
        { 
            id: 'equal', 
            x: opX + groupGap + count2 * gapX + 40, 
            y: baseY, 
            src: '/equal.png',
            isObj: false, // 객체 아님. 기호임
        }
    );

    // 왼쪽 객체들
    for (let i = 0; i < count1; i++) {
        objectsInfo.push(
            { 
                id: `left-${i+1}`,
                x: startX + i * gapX,
                y: baseY,
                src: objImage,
                isObj: true, // 객체임
            }
        );
    }

    // 오른쪽 객체들
    for (let i = 0; i < count2; i++) {
        objectsInfo.push(
            { 
                id: `right-${i+1}`, 
                x: opX + groupGap + i * gapX,
                y: baseY,
                src: objImage,
                isObj: true, // 객체임
            }
        );
    }

    return objectsInfo
}