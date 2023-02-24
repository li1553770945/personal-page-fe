import instance from "./request";
 
export const logoutAPI = () => instance.get("/logout");
 
// post请求，有参数
export const loginAPI = (data: any) =>
  instance.post("/login", data);
 
// post请求 ，没参数，但要路径传参
export const userInfoAPI = () =>
  instance.get(`/user-info`);
 