export enum Gender {
  Male = "male",
  Female = "female",
}

export interface UserHealthInfo {
  gender: Gender;
  height: number; // 신장 (cm)
  weight: number; // 체중 (kg)
  age: number; // 나이
}

// 여기서 a, b, c, d는 상수이며, 각각의 역할은 다음과 같습니다:

// a: 기본값으로 시작하는 BMR 값입니다.
// b: 체중에 대한 가중치입니다.
// c: 신장에 대한 가중치입니다.
// d: 나이에 대한 가중치입니다.

const MALE_BMR_CONSTANTS = {
  a: 66,
  b: 13.7,
  c: 5,
  d: 6.8,
};

const FEMALE_BMR_CONSTANTS = {
  a: 655,
  b: 9.6,
  c: 1.8,
  d: 4.7,
};

/** 성별, 키, 몸무게, 나이를 입력받아 기초 대사량을 구하는 함수  */
export function calculateBMR(userInfo: UserHealthInfo): number {
  const { gender, height, weight, age } = userInfo;

  let bmr: number;

  if (gender === Gender.Male) {
    const { a, b, c, d } = MALE_BMR_CONSTANTS;
    bmr = a + b * weight + c * height - d * age;
  } else if (gender === Gender.Female) {
    const { a, b, c, d } = FEMALE_BMR_CONSTANTS;
    bmr = a + b * weight + c * height - d * age;
  } else {
    throw new Error("Invalid gender");
  }

  return Math.floor(bmr);
}
