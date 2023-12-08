import instance from "./request";

export const logoutAPI = () => instance.get("/logout");

// post请求，有参数
export const loginAPI = (data: any) =>
  instance.post("/users/login", data);

export const registerAPI = (data: any) =>
  instance.post("/users/register", data);

export const generateCodeAPI = (data: any) =>
  instance.post("/users/activate-code", data);

export const userInfoAPI = () =>
  instance.get(`users/me`);


export const fileInfoAPI = (fileKey: any) =>
  instance.get(`/files/info?file-key=${fileKey}`);

export const deleteFileAPI = (fileKey: any) =>
  instance.delete(`/file/${fileKey}`);

export const allMessageCategoriesAPI = () =>
  instance.get('/messages/categories')

export const saveMessageAPI = (data: any) =>
  instance.post("/messages", data);

export const getReplyAPI = (uuid: string) =>
  instance.get(`/messages/reply?uuid=${uuid}`);

export const addReplyAPI = (data: any) =>
  instance.post("/messages/reply", data);


export const getMessageAPI = (uuid: string) =>
  instance.get("/messages?uuid=" + uuid);

export const notReadMessageAPI = () =>
  instance.get("/messages?unread=true");






  