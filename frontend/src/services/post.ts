import { apiInstance } from "./api";

const createPostService = async (post: any) => {
  const response = await apiInstance.post("/createPost", post);
  return response;
};

const getPostsService = async (page: number, limit: number) => {
  const response = await apiInstance.get(`/getPosts?page=${page}&limit=${limit}`);
  return response;
};

export { createPostService, getPostsService };