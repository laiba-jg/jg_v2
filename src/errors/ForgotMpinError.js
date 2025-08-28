export class ForgotMpinError extends Error {
  constructor(message = 'Failed to reset mPIN') {
    super(message);
    this.name = 'ForgotMpinError';
    this.status = 400;
  }
}