export interface FlutterwaveResponse<T> {
  status: string;
  message: string;
  data: T;
}
