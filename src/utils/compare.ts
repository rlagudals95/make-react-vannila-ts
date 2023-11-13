export function deepEqual(obj1: any, obj2: any): boolean {
  // 일반적인 경우에 대한 빠른 비교
  if (obj1 === obj2) {
    return true;
  }

  // null 또는 다른 유형을 비교하는 경우
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 키 수 비교
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 모든 키에 대해 재귀적으로 비교
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
