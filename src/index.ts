import DeasyncifyError from "./errors/DeasyncifyError";
import DeasyncifyErrorMsgs from "./errors/DeasyncifyErrorMessages";
export default class Deasyncify {
  public static watch = async <T>(
    asyncParam: Promise<T> | (() => Promise<T>)
  ): Promise<[T | null, any]> => {
    try {
      if (asyncParam == null)
        throw new DeasyncifyError(DeasyncifyErrorMsgs.watch.EMPTY_ARGUMENT);
      let expectedValue: T;
      if (asyncParam instanceof Function) expectedValue = await asyncParam();
      else if (asyncParam instanceof Promise) expectedValue = await asyncParam;
      else
        throw new DeasyncifyError(
          DeasyncifyErrorMsgs.watch.INVALID_TYPE(typeof asyncParam)
        );
      return [expectedValue, null];
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
    /* 
  Errors are handled because of javascript users and would not have been implemented if it wasn't for them :(  
    Just to be safe.
    */
    try {
      switch (true) {
        case asyncArr == null:
          throw new DeasyncifyError(
            DeasyncifyErrorMsgs.watchMany.EMPTY_ARGUMENT
          );

        case Array.isArray(asyncArr) === false:
          throw new DeasyncifyError(
            DeasyncifyErrorMsgs.watchMany.INVALID_TYPE(typeof asyncArr)
          );

        default:
          const toBeResolvedPromises = asyncArr.map((asyncParam, idx) => {
            switch (true) {
              case asyncParam instanceof Function:
                return (asyncParam as unknown as Function)();
              case asyncParam instanceof Promise:
                return asyncParam;
              default:
                throw new DeasyncifyError(
                  DeasyncifyErrorMsgs.watchMany.INVALID_ASYNC_ELEMENT(
                    typeof asyncParam,
                    idx
                  )
                );
            }
          });
          const expectedValues = await Promise.all<G[]>(toBeResolvedPromises);
          return [expectedValues, null];
      }
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
    switch (true) {
      case asyncArr == null:
        throw new DeasyncifyError(DeasyncifyErrorMsgs.watchMany.EMPTY_ARGUMENT);

      case Array.isArray(asyncArr) === false:
        throw new DeasyncifyError(
          DeasyncifyErrorMsgs.watchMany.INVALID_TYPE(typeof asyncArr)
        );

      default:
        const promisesToBeSettled = asyncArr.map((asyncParam, idx) => {
          switch (true) {
            case asyncParam instanceof Function:
              return (asyncParam as unknown as Function)();
            case asyncParam instanceof Promise:
              return asyncParam;
            default:
              throw new DeasyncifyError(
                DeasyncifyErrorMsgs.watchMany.INVALID_ASYNC_ELEMENT(
                  typeof asyncParam,
                  idx
                )
              );
          }
        });
        let result = await Promise.allSettled(promisesToBeSettled);

        const allResolved: G[] = [];

        const allRejected: any[] = [];

        result.forEach((promise) => {
          if (promise.status === "fulfilled") allResolved.push(promise.value);
          else if (promise.status === "rejected")
            allRejected.push(promise.reason);
        });

        return [allResolved, allRejected];
    }
  };
}

export { default as DeasyncifyError } from "./errors/DeasyncifyError";
