export default class BaseResponse<T> {
  constructor(private status: number, private message: string, private data: T) {}
}
