import instance from "./request";

export const logoutAPI = () => instance.get("/logout");

// post请求，有参数
export const loginAPI = (data: any) =>
  instance.post("/login", data);

export const registerAPI = (data: any) =>
  instance.post("/register", data);

export const generateCodeAPI = (data: any) =>
  instance.post("/generate-activate-code", data);

// post请求 ，没参数，但要路径传参
export const userInfoAPI = () =>
  instance.get(`/user-info`);


export const fileInfoAPI = (fileKey: any) =>
  instance.get(`/file-info?file_key=` + fileKey);

export const deleteFileAPI = (fileKey: any) =>
  instance.delete(`/delete-file?file_key=` + fileKey);

export const allMessageCategoriesAPI = () =>
  instance.get('/all-message-categories')

export const saveMessageAPI = (data: any) =>
  instance.post("/message", data);

  export const getReplyAPI = (uuid:string) =>
  instance.get("/reply?uuid="+uuid);

  export const addReplyAPI = (data: any) =>
  instance.post("/reply", data);
