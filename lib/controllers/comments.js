const {Router} = require('express');
const Comment = require('../models/Comment')
const ensureAuth = require('../middleware/ensureAuth')

module.exports = Router()
    .post('/', ensureAuth, async (req, res, next) => {
        const comment = await Comment.insert({
            ...req.body,
            commentBy: req.user.username
        },
        )
        res.send(comment)
    });
    // .get('/', ensureAuth, async (req, res, next) => {
    //     console.log(req.user.username);
    //     const allPosts = await Post.getAll()
    //     res.send(allPosts)
    // });
