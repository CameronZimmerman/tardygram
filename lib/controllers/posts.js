const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    const post = await Post.insert({
      ...req.body,
      username: req.user.username,
    });
    res.send(post);
  })
  .get('/', ensureAuth, async (req, res, next) => {
    const allPosts = await Post.getAll();
    res.send(allPosts);
  })
  .get('/:id', ensureAuth, async (req, res, next) => {
    const result = await Post.getById(req.params.id);
    res.send(result);
  })
  .patch('/:id', ensureAuth, async (req, res, next) => {
    const updatedPost = await Post.update({
      ...req.body,
      username: req.user.username,
      id: req.params.id,
    });
    res.send(updatedPost);
  })
  .delete('/:id', ensureAuth, async (req, res, next) => {
    const deletedPost = await Post.delete(req.user.username, req.params.id);
    res.send(deletedPost);
  });
