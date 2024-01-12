export interface ServerResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
