const { Router } = require('express');
const UserServices = require('../services/UserServices');

module.exports = Router()
.get('/login', (req, res) => {
  res
    .redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scopes=read:user`
    )

})
.get('/login/callback', async (req, res, next) => {
  const user = await UserServices.create(req.query.code);
  res.send(user);
});
