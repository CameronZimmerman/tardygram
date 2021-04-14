const { exchangeTokenForCode } = require('../utils/github');

module.exports = class UserServices {
  static async create(code) {
    // grab the token by giving github our code
    const token = await exchangeTokenForCode(code);
    //get the profile from github with the token
    // const profile = await getUserProfile(token);
    //insert profile into db
  }
};
