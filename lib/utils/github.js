const fetch = require('node-fetch');

const exchangeTokenForCode = (code) => {
  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };

  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(({ access_token }) => access_token);
};

const getProfile = (token) => {
  return fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .then(({ login, avatar_url }) => ({
      username: login,
      photoUrl: avatar_url,
    }));
};

module.exports = { exchangeTokenForCode, getProfile };
