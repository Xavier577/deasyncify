export default class AsyncHook {
  public static watch = async <T>(
    asyncObj: Promise<T> | (() => Promise<T>)
  ): Promise<[T | null, any]> => {
    try {
      let result =
        asyncObj instanceof Function ? await asyncObj() : await asyncObj;
      return [result, null];
    } catch (err) {
      let error = err;
      return [null, error];
    }
  };

  public static watchAll = async <J, T extends Awaited<J>>(
    asyncArr: J[]
  ): Promise<[T[] | null, any]> => {
    try {
      const toBeResolvedPromises = asyncArr.map((asyncObj) =>
        asyncObj instanceof Function ? asyncObj() : asyncObj
      );
      const result = await Promise.all<T[]>(toBeResolvedPromises);
      return [result, null];
    } catch (err: any) {
      return [null, err];
    }
  };

  public static watchSettled = async <T>(
    asyncArr: Promise<T>[] | (() => Promise<T>)[]
  ): Promise<[PromiseFulfilledResult<T>[], PromiseRejectedResult[]]> => {
    let result = await Promise.allSettled(
      asyncArr.map((asyncObj) =>
        asyncObj instanceof Function ? asyncObj() : asyncObj
      )
    );

    const allResolved: PromiseFulfilledResult<T>[] = [];

    const allRejected: PromiseRejectedResult[] = [];

    result.forEach((promise) => {
      if (promise.status === "fulfilled") allResolved.push(promise);
      else if (promise.status === "rejected") allRejected.push(promise);
    });

    return [allResolved, allRejected];
  };
}
