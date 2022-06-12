export default class DeasyncifyError extends Error {
  constructor(message: string) {
    super(`DeasyncifyError: ${message}`);
    Object.setPrototypeOf(this, DeasyncifyError.prototype);
  }
}
