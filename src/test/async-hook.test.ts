import AsyncHook from "../async-hook";

describe("Test for AsyncHook class", () => {
  it("Should be defined", () => {
    expect(AsyncHook).toBe.defined();
  });

  it("Should watch should handle a resolved promise", async () => {
    const promise1 = Promise.resolve(20);
    const [result, err] = await AsyncHook.watch(promise1);
    expect(err).toBe.undefined();
    expect(result).toBe.defined();
  });
});
