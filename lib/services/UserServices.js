const { exchangeTokenForCode, getProfile } = require('../utils/github');
const User = require('../models/User');
module.exports = class UserServices {
  static async create(code) {
    // grab the token by giving github our code
    const token = await exchangeTokenForCode(code);
    //get the profile from github with the token
    const profile = await getProfile(token);
    //insert profile into db
    const user = await User.findByUsername(profile.username);
    if (user.length < 1) {
      return await User.insert(profile);
    }
    return user;
  }
};
