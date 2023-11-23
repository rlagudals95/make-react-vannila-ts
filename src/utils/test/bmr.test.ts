import { calculateBMR, Gender } from "../bmr";

describe("calculateBMR function", () => {
  test("calculates BMR for male", () => {
    const userInfo = {
      gender: Gender.Male,
      height: 180,
      weight: 75,
      age: 30,
    };

    const result = calculateBMR(userInfo);

    expect(result).toBe(1789);
  });

  test("calculates BMR for female", () => {
    const userInfo = {
      gender: Gender.Female,
      height: 160,
      weight: 60,
      age: 25,
    };

    const result = calculateBMR(userInfo);

    // 기대되는 결과 값에 따라 수정해주세요.
    expect(result).toBe(1401);
  });
});
