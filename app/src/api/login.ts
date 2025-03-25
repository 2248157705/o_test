import { request } from "../fetch";
import type { loginBySMSParams } from "@/types/login";
import type { userParams } from "@/types/user";

export const loginBySMS = (data: loginBySMSParams) => {
  return request.post<userParams>("/client/users/account/loginBySMS", data);
};

export const sendSMS = (data) => {
  return request.post("/client/common/phone/sendSMS", data);
};

export const thirdLogin = (data) => {
  return request.post("/client/users/account/loginByOAuth2", data);
};
