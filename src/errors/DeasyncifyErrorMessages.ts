export default class DeasyncifyErrorMsgs {
  public static watch = {
    EMPTY_ARGUMENT:
      "Expected 1 argument of type Promise<T> | (() => Promise<T>) but received none",
    INVALID_TYPE: (type: string) =>
      `Expect argument of type Promise<T> | () => Promise<T> but instead received type ${type}`,
  };

  public static watchMany = {
    EMPTY_ARGUMENT:
      "Expected 1 argument of type (Promise<T> | (() => Promise<T>))[] but received none",
    INVALID_TYPE: (type: string) =>
      `Expect argument of type (Promise<T> | (() => Promise<T>))[] but instead received type ${type}`,
    INVALID_ASYNC_ELEMENT: (type: string, index: number) =>
      `INVALID ELEMENT of index ${index} in asyncArr param is of type ${type} which does not satisfy type Promise<T> | (() => Promise<T>)`,
  };
}
