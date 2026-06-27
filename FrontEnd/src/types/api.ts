export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: ApiFieldError[];
  meta?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public errors?: ApiFieldError[],
    public statusCode?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
