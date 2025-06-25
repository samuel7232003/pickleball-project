const {
  createPostService,
  getPostService,
  getPostsService,
} = require("../services/postService");
const { getCourtService } = require("../services/courtService");
const { getUserService } = require("../services/accountService");
const { getImageCourtService } = require("../services/imageCourtService");

const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = await createPostService(post);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const { posts, total } = await getPostsService(page, limit);
    const postsWithCourt = await Promise.all(
      posts.map(async (post) => {
        const court = await getCourtService(post.courtId);
        const images = await getImageCourtService(post.courtId);
        const user = await getUserService(post.userId);
        return {
          ...post._doc,
          courtData: { ...court._doc, images },
          userData: user,
        };
      })
    );
    res.status(200).json({ posts: postsWithCourt, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  const { postId } = req.query;
  try {
    const post = await getPostService(postId);
    if (post) {
      const court = await getCourtService(post.courtId);
      const user = await getUserService(post.userId);
      const postWithCourt = {
        ...post,
        courtData: court,
        userData: user,
      };
      res.status(200).json(postWithCourt);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
};
