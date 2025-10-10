// 객체 타입
export type Obj = { 
    id: string; x: number; y: number; src: string, 
    isObj: boolean, // 객체인지
    value: null | number, // 숫자라면 값이 있음
    };

/* 1600 x 900을 기준으로 배치 */
export function getObjectsInfo(
    probType="addition", 
    entity: string, 
    count1: number, 
    count2: number): Obj[] {
    
    const objectsInfo: Obj[] = [ // 문제 풀이를 위한 객체
        // 처음엔 아무것도 없음
    ];

    let objImage = '/asset/사과.png'; // 객체로 넣을 이미지
    if (entity == 'apple') // 현재는 사과 이미지만 가능
        objImage = '/asset/사과.png';

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
            src: '/asset/plus.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
        }
    );

    // = 기호
    objectsInfo.push(
        { 
            id: 'equal', 
            x: opX + groupGap + count2 * gapX + 40, 
            y: baseY, 
            src: '/asset/equal.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
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
                value: null,
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
                value: null,
            }
        );
    }

    return objectsInfo
}

/* 1600 x 900을 기준으로 배치 */
export function getAnswerInfo(
    problem: string,
    count1: number, 
    count2: number,
    answer: number,
    wrongAnswer: number[]
) : Obj[] {
    
    const answerInfo: Obj[] = [ // 정답 맞추기 위한 객체
    // 처음엔 아무것도 없음
    ];

    // 첫번째 숫자
    answerInfo.push(
        {
            id: 'count1', 
            x: 500, 
            y: 300, 
            src: `/asset/${count1}.png`,
            isObj: false, // 객체 아님
            value: count1,
        }
    );

    // 두번째 숫자
    answerInfo.push(
        {
            id: 'count2', 
            x: 800, 
            y: 300, 
            src: `/asset/${count2}.png`,
            isObj: false, // 객체 아님
            value: count2,
        }
    );

    // + 기호
    answerInfo.push(
        {
            id: 'plus', 
            x: 650, 
            y: 300, 
            src: '/asset/plus.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
        }
    );

    // = 기호
    answerInfo.push(
        { 
            id: 'equal', 
            x: 950, 
            y: 300, 
            src: '/asset/equal.png',
            isObj: false, // 객체 아님. 기호임
            value: null,
        }
    );

    const choices: number[] = [
        answer, wrongAnswer[0], wrongAnswer[1]
    ];
    choices.sort(); // 오름차순으로 정렬

    // 선택지 1
    answerInfo.push(
        {
            id: 'choice1', 
            x: 500, 
            y: 600, 
            src: `/asset/${choices[0]}.png`,
            isObj: true, // 객체임
            value: choices[0],
        }
    );

    // 선택지 2
    answerInfo.push(
        {
            id: 'choice1', 
            x: 800, 
            y: 600, 
            src: `/asset/${choices[1]}.png`,
            isObj: true, // 객체임
            value: choices[1],
        }
    );

    // 선택지 3
    answerInfo.push(
        {
            id: 'choice1', 
            x: 1100, 
            y: 600, 
            src: `/asset/${choices[2]}.png`,
            isObj: true, // 객체임
            value: choices[2],
        }
    );
    
    return answerInfo
}