import { deepEqual } from "../compare";

describe("deepEqual", () => {
  it("같은 객체는 true를 반환해야 함", () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(deepEqual(obj, obj)).toBe(true);
  });

  it("객체의 값이 동일한 경우 true를 반환해야 함", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };

    const obj3 = { a: { a1: 1, a2: 2, a3: 3, a4: 4 }, b: { c: 2 } };
    const obj4 = { a: { a1: 1, a2: 2, a3: 3, a4: 4 }, b: { c: 2 } };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj3, obj4)).toBe(true);
  });

  it("객체의 값이 다를 경우 false를 반환해야 함", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };

    const obj3 = { a: { a1: 1, a2: 2, a3: 3, a4: 4 }, b: { c: 2 } };
    const obj4 = { a: { a1: 1, a2: 2, a3: 3, a4: 5 }, b: { c: 2 } };

    expect(deepEqual(obj1, obj2)).toBe(false);
    expect(deepEqual(obj3, obj4)).toBe(false);
  });

  it("다른 타입을 비교할 경우 false를 반환해야 함", () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(deepEqual(obj, "not an object")).toBe(false);
  });

  it("키가 누락된 경우 false를 반환해야 함", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1 };
    expect(deepEqual(obj1, obj2)).toBe(false);
  });
});
