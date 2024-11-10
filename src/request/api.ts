import instance from "./request";

export const logoutAPI = () => instance.get("/users/logout");

// post请求，有参数
export const loginAPI = (data: any) =>
  instance.post("/auth/login", data);

export const registerAPI = (data: any) =>
  instance.post("/users/register", data);

export const generateCodeAPI = (data: any) =>
  instance.post("/users/activate-code", data);

export const userInfoAPI = () =>
  instance.get(`users/me`);


export const fileInfoAPI = (fileKey: any) =>
  instance.get(`/files/info?file-key=${fileKey}`);

export const deleteFileAPI = (fileID: number) =>
  instance.delete(`/files/${fileID}`);

export const allFeedbackCategoriesAPI = () =>
  instance.get('/feedback/categories')

export const saveFeedbackAPI = (data: any) =>
  instance.post("/feedback", data);

export const getReplyAPI = (uuid: string) =>
  instance.get(`/feedback/reply?feedbackUuid=${uuid}`);

export const addReplyAPI = (data: any) =>
  instance.post("/feedback/reply", data);


export const getFeedbackAPI = (uuid: string) =>
  instance.get("/feedback?uuid=" + uuid);

export const notReadFeedbackAPI = () =>
  instance.get("/feedback/unread");

export const getProjectsNumAPI = () =>
  instance.get("/projects/num");

export const getProjectsAPI = (start:number,end:number,status:number,order:string) =>
  instance.get("/projects?start="+start+"&end="+end+"&status="+status+"&order="+order);

export const addProjectAPI = (data:any) =>
  instance.post("/projects",data);

export const deleteProjectAPI = (id:number) =>
  instance.delete("/projects/"+id);






  