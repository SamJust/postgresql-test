const Posts = require('../models/postsModels');

module.exports = {
  Get: async function (req, res) {
    try {
      const posts = await Posts.GetAllPosts();
      res.json(posts.rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  GetWithId: async function (req, res) {
    try {
      const { postId } = req.params;
      const post = await Posts.GetPostById(postId);
      res.json(post.rows[0]);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  Post: async function (req, res) {
    try {
      const newPost = await Posts.CreatePost(req.body);
      const newPostJoined = await Posts.GetPostById(newPost.rows[0].post_id);
      res.status(201).json(newPostJoined.rows[0]);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  Delete: async function (req, res) {
    try {
      const { postId } = req.params;
      await Posts.DeletePost(postId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  Patch: async function (req, res) {
    try {
      const { postId } = req.params;
      const { title = null, body = null } = req.body;
      const newPost = await Posts.UpdatePost(postId, {title, body});
      res.json(newPost.rows[0])
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
};