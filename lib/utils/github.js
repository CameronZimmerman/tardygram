const fetch = require('node-fetch');

const exchangeTokenForCode = (code) => {
  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };

  return fetch('https://github.com/login/oauth/access_token?', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
};

module.exports = { exchangeTokenForCode };
