class AppError extends Error {
  constructor(readonly message: string, readonly statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
