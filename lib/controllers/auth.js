const { Router } = require('express');
const UserServices = require('../services/UserServices');
const {getToken, verifyToken} = require('../utils/jwt');

const expiry = 1000 * 60 * 60 * 24;
module.exports = Router()
.get('/login', (req, res) => {
  res
    .redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scopes=read:user`
    )

})
.get('/login/callback', async (req, res, next) => {
  const user = await UserServices.create(req.query.code);
  res.cookie('session', await getToken(user), {
    httpOnly: true,
    maxAge: expiry,
  });
  console.log(getToken(user));
  res.send(JSON.stringify());
})

.get('/verify', (ensureAuth), async (req, res, next) => {
 
})
