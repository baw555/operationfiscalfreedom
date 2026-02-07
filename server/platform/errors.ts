export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (code: string, msg: string) =>
  new ApiError(400, code, msg);

export const unauthorized = (code: string, msg: string) =>
  new ApiError(401, code, msg);

export const forbidden = (code: string, msg: string) =>
  new ApiError(403, code, msg);
