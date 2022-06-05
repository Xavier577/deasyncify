export default class AsyncHook {
  public static watch = async <T>(
    asyncObj: Promise<T> | (() => Promise<T>)
  ): Promise<[T | null | undefined, any]> => {
    try {
      let result =
        asyncObj instanceof Function ? await asyncObj() : await asyncObj;
      return [result, null];
    } catch (err) {
      let error = err;
      return [null, error];
    }
  };

  public static watchAll = async <T>(
    asyncArr: Promise<T>[] | (() => Promise<T>)[]
  ): Promise<[T[] | null | undefined, any]> => {
    try {
      let result = await Promise.all(
        asyncArr.map((asyncObj) =>
          asyncObj instanceof Function ? asyncObj() : asyncObj
        )
      );
      return [result, null];
    } catch (err) {
      return [null, err];
    }
  };

  public static watchSettled = async <T>(
    asyncArr: Promise<T>[] | (() => Promise<T>)[]
  ): Promise<PromiseSettledResult<T>[]> => {
    let result = await Promise.allSettled(
      asyncArr.map((asyncObj) =>
        asyncObj instanceof Function ? asyncObj() : asyncObj
      )
    );
    return result;
  };
}
