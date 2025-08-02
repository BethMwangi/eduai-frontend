// src/types/api.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  error?: string;
  [key: string]: unknown; // can include field-specific errors
}
export type ValidationErrorResponse = Record<string, string[]>;

 
/** Type guard for ApiResponse. */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (typeof value !== "object" || value === null) return false;
  return Object.prototype.hasOwnProperty.call(value, "data");
}

/** Unwraps either a raw payload or an ApiResponse-wrapped payload. */
export function unwrapApi<T>(res: T | ApiResponse<T>): T {
  return isApiResponse<T>(res) ? res.data : res;
}


