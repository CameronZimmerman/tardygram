const { exchangeTokenForCode, getProfile } = require('../utils/github');

module.exports = class UserServices {
  static async create(code) {
    // grab the token by giving github our code
    const token = await exchangeTokenForCode(code);
    console.log(token);
    //get the profile from github with the token
    const profile = await getProfile(token);
    console.log(profile);
    //insert profile into db
  }
};
