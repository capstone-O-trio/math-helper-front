export function safeParse(data: any) {
  let result = data;

  // 문자열이고 JSON 객체처럼 생겼다면 계속 파싱
  while (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      result = parsed;
    } catch {
      break; // 더 이상 파싱 불가 → 종료
    }
  }

  return result;
}
