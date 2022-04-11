export class HttpError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = 'HttpError';
  }
}

export class BadRequestError extends HttpError {
  constructor() {
    super('Bad Request', 400);
  }
}
