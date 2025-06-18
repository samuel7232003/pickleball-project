const postModel = require("../models/Post");

const createPostService = async (post) => {
  const newPost = await postModel.create(post);
  return newPost;
};

const getPostService = async (postId) => {
  const post = await postModel.findById(postId);
  return post;
};

const getPostsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const posts = await postModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return posts;
};

module.exports = {
  createPostService,
  getPostService,
  getPostsService,
};
