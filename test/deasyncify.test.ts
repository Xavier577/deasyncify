import Deasyncify from "../src";

describe("Test for Deasyncify class", () => {
  it("Should be defined", () => {
    expect(Deasyncify).toBeDefined();
  });

  it("Deasyncify.watch should be defined", () => {
    expect(Deasyncify.watch).toBeDefined();
  });

  it("Deasyncify.watch should handle a resolved promise/async function with the resolved data and no error", async () => {
    const promise1 = Promise.resolve(20);
    const [result, err] = await Deasyncify.watch(promise1);
    expect(err).toBeNull();
    expect(result).toBeDefined();
    expect(result).toEqual(20);
  });

  it("Deasyncify.watch should handle a rejected promise/async function with empty (null) resolved data and error", async () => {
    const promise1 = Promise.reject(new Error("This should fail"));
    const [result, err] = await Deasyncify.watch(promise1);
    expect(result).toBeNull();
    expect(err).toBeDefined();
    expect(err.message).toEqual("This should fail");
  });

  it("Deasyncify.watchAll should be defined", () => {
    expect(Deasyncify.watchAll).toBeDefined();
  });

  it("Deasyncify.watchAll should throw an error when somehow a none promise or async function is passed in the asynArr param", () => {
    Deasyncify.watchAll([() => 1, "1"]).catch((err) => {
      expect(err).toBeDefined();
    });
  });

  it("Deasyncify.watchAll should handle all resolved promises/async functions with the resolved data arr and no errors", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.resolve(false);
    const asyncFn1 = async () => 4;
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results, err] = await Deasyncify.watchAll([
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

  it("Deasyncify.watchAll should handle rejection from promises/async-functions with the no resolved data arr and the error causing the rejection", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.reject(new Error("Promise Error!"));
    const asyncFn1 = async () => {
      throw new Error("AsyncFn Error!");
    };
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results1, err1] = await Deasyncify.watchAll([
      promise2,
      asyncFn3,
      promise3,
    ]);

    const [result2, err2] = await Deasyncify.watchAll([
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

  it("Deasyncify.watchSettled should be defined", () => {
    expect(Deasyncify.watchSettled).toBeDefined();
  });

  it("Deasyncify.watchSettled should throw an error when somehow a none promise or async function is passed in the asynArr param", () => {
    Deasyncify.watchSettled([() => 1, "1"]).catch((err) => {
      expect(err).toBeDefined();
    });
  });

  it("Deasyncify.watchSettled should return all Resolved Promises and no rejected promises when there are no rejected promises ", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.resolve(false);
    const asyncFn1 = async () => 4;
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results, errors] = await Deasyncify.watchSettled([
      promise1,
      asyncFn1,
      promise2,
      asyncFn2,
      promise2,
      asyncFn3,
      promise3,
    ]);

    expect(errors.length).toEqual(0);
    expect(results).toBeDefined();

    const expectedValues = ["1", 2, false, 4, true, "6"];
    results?.forEach((resolved) => {
      expect(resolved).toBeDefined();
      //@ts-ignore
      expect(expectedValues.includes(resolved)).toBeTruthy();
    });
  });

  it("Deasyncify.watchSettled should handle all rejections promise/async-function with all the errors and all the data from the promises/async-function resolved", async () => {
    const promise1 = Promise.resolve("1");
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.reject(new Error("Promise Error!"));
    const asyncFn1 = async () => {
      throw new Error("AsyncFn Error!");
    };
    const asyncFn2 = async () => true;
    const asyncFn3 = async () => "6";

    const [results1, err1] = await Deasyncify.watchSettled([
      promise2,
      asyncFn3,
      promise3,
    ]);

    const [result2, err2] = await Deasyncify.watchSettled([
      asyncFn2,
      asyncFn1,
      promise1,
    ]);

    const resolvedValues1 = [2, "6"];
    const resolvedValues2 = ["1", true];

    expect(results1.length).toBeGreaterThan(0);
    expect(result2.length).toBeGreaterThan(0);

    expect(err1.length).toBeGreaterThan(0);
    expect(err1[0].message).toEqual("Promise Error!");

    expect(err2.length).toBeGreaterThan(0);
    expect(err2[0].message).toEqual("AsyncFn Error!");

    results1.forEach((resolved) => {
      expect(resolved).toBeDefined();
      // @ts-ignore
      expect(resolvedValues1.includes(resolved)).toBeTruthy();
    });

    result2.forEach((resolved) => {
      expect(resolved).toBeDefined();
      // @ts-ignore
      expect(resolvedValues2.includes(resolved)).toBeTruthy();
    });
  });
});
