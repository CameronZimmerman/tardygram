const { Router } = require('express');

module.exports = Router()

  .get('/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scopes=read:user`)

  .get('/login/callback', (req, res, next) => {
    //service stuff
  })
})