export default class Deasyncify {
  public static watch = async <T>(
    asyncObj: Promise<T> | (() => Promise<T>)
  ): Promise<[T | null, any]> => {
    try {
      let result: T;
      if (asyncObj instanceof Function) result = await asyncObj();
      else if (asyncObj instanceof Promise) result = await asyncObj;
      else
        throw new Error(
          "AsyncHook error: params is neither a promise or an async function"
        );
      return [result, null];
    } catch (err) {
      let error = err;
      return [null, error];
    }
  };

  public static watchAll = async <
    J,
    T extends Awaited<J>,
    G = T extends () => any ? Awaited<ReturnType<T>> : T
  >(
    asyncArr: J[]
  ): Promise<[G[] | null, any]> => {
    try {
      const toBeResolvedPromises = asyncArr.map((asyncObj, idx) => {
        if (asyncObj instanceof Function) return asyncObj();
        else if (asyncObj instanceof Promise) return asyncObj;
        else
          throw new Error(
            `AsyncHook Error: asyncArr contains an element which is neither a promise or an async function at index ${idx} `
          );
      });
      const result = await Promise.all<G[]>(toBeResolvedPromises);
      return [result, null];
    } catch (err: any) {
      return [null, err];
    }
  };

  public static watchSettled = async <
    J,
    T extends Awaited<J>,
    G = T extends () => any ? Awaited<ReturnType<T>> : T
  >(
    asyncArr: J[]
  ): Promise<[G[], any[]]> => {
    const promisesToBeSettled = asyncArr.map((asyncObj, idx) => {
      if (asyncObj instanceof Function) return asyncObj();
      else if (asyncObj instanceof Promise) return asyncObj;
      else
        throw new Error(
          `AsyncHook Error: asyncArr contains an element which is neither a promise or an async function at index ${idx} `
        );
    });
    let result = await Promise.allSettled<G[]>(promisesToBeSettled);

    const allResolved: G[] = [];

    const allRejected: any[] = [];

    result.forEach((promise) => {
      if (promise.status === "fulfilled") allResolved.push(promise.value);
      else if (promise.status === "rejected") allRejected.push(promise.reason);
    });

    return [allResolved, allRejected];
  };
}
