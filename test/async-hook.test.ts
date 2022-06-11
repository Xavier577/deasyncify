import AsyncHook from "../src/async-hook";

describe("Test for AsyncHook class", () => {
  it("Should be defined", () => {
    expect(AsyncHook).toBeDefined();
  });

  it("AsyncHook.watch should handle a resolved promise/async function with the resolved data and no error", async () => {
    const promise1 = Promise.resolve(20);
    const [result, err] = await AsyncHook.watch(promise1);
    expect(err).toBeNull();
    expect(result).toBeDefined();
    expect(result).toEqual(20);
  });

  it("AsyncHook.watch should handle a rejected promise/async function with empty (null) resolved data and error", async () => {
    const promise1 = Promise.reject(new Error("This should fail"));
    const [result, err] = await AsyncHook.watch(promise1);
    expect(result).toBeNull();
    expect(err).toBeDefined();
    expect(err.message).toEqual("This should fail");
  });

  it("AsyncHook.watchAll should handle all resolved promises/async functions with the resolved data arr and no errors", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.resolve(false);
    const asyncFn1 = async () => 4;
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results, err] = await AsyncHook.watchAll([
      promise1,
      asyncFn1,
      promise2,
      asyncFn2,
      promise2,
      asyncFn3,
      promise3,
    ]);

    expect(err).toBeNull();
    expect(results).toBeDefined();

    const expectedValues = ["1", 2, false, 4, true, "6"];
    results?.forEach((resolved) => {
      expect(resolved).toBeDefined();
      //@ts-ignore
      expect(expectedValues.includes(resolved)).toBeTruthy();
    });
  });

  it("AsyncHook.watchAll should handle all resolved promises/async functions with the resolved data arr and no errors", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.reject(new Error("Promise Error!"));
    const asyncFn1 = async () => {
      throw new Error("AsyncFn Error!");
    };
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results1, err1] = await AsyncHook.watchAll([
      promise2,
      asyncFn3,
      promise3,
    ]);

    const [result2, err2] = await AsyncHook.watchAll([
      asyncFn2,
      asyncFn1,
      promise1,
    ]);

    expect(results1).toBeNull();
    expect(result2).toBeNull();

    expect(err1).toBeDefined();
    expect(err1.message).toEqual("Promise Error!");

    expect(err2).toBeDefined();
    expect(err2.message).toEqual("AsyncFn Error!");
  });
});
