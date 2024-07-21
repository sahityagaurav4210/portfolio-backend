export const API_BASEURL = '/api/v1';

export enum HTTP_STATUS_CODES {
  OK = 200,
  CREATED = 201,
  UPDATED = 202,
  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_LARGE_REQ = 413,
  INV_PAYLOAD = 422,
  SERVER_ERR = 500,
  UNAVAILABLE = 503,
}

export enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
  EXCEPTION = 'exception',
  VALIDATION = 'validation',
  CONFLICT = 'already exists',
  UNDEFINED = 'not defined',
  UNAUTHORISED = 'unauthorised',
}

export class ApiResponse {
  constructor();
  constructor(status: Status, message: string);
  constructor(status: Status, message: string, data: any, entryBy: string);

  constructor(
    private status = Status.UNDEFINED,
    private message = '',
    private data = null,
    private entryBy = '127.0.0.1'
  ) {}

  public get STATUS() {
    return this.status;
  }

  public set STATUS(value: Status) {
    this.status = value;
  }

  public get MESSAGE() {
    return this.message;
  }

  public set MESSAGE(value: string) {
    this.message = value;
  }

  public get DATA() {
    return this.data;
  }

  public set DATA(value: any) {
    this.data = value;
  }

  public get ENTRY_BY() {
    return this.entryBy;
  }

  public set ENTRY_BY(value: string) {
    this.entryBy = value;
  }
}
