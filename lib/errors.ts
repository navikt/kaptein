export class UnauthorizedError extends Error {
  constructor() {
    super('Du er logget ut.');
  }
}

export class InternalServerError extends Error {
  public status: number | string;

  constructor(status: number | string, message: string) {
    super(`Noe gikk galt. (${status}) - ${message}`);
    this.status = status;
  }
}
