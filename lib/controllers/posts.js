const {Router} = require('express');
const Post = require('../models/Post')
const ensureAuth = require('../middleware/ensureAuth')

module.exports = Router()
    .post('/', ensureAuth, async (req, res, next) => {
        const post = await Post.insert({
            ...req.body,
            username: req.user.username

        },
        )
        res.send(post)
    })
    .get('/', ensureAuth, async (req, res, next) => {
        console.log(req.user.username);
        const allPosts = await Post.getAll()
        res.send(allPosts)
    });



