export interface ICaptchaPayload {
  token: string;
  data: string;
  verified?: boolean;
}