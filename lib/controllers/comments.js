const {Router, request} = require('express');
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
    })
    .delete('/:id', ensureAuth, async (req, res, next) => {
        const deleteComment = await Comment.delete(
            req.params.id,
        )
        res.send(deleteComment)
    });
