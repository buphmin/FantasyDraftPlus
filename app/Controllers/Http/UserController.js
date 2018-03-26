'use strict'
const User = use ('App/Models/User');
const Token = use ('App/Models/Token');

class UserController {
  async login({request, auth}) {
    const { email, password } = request.all();
    return await auth.attempt(email, password);
  }

  async getUser({params}) {
    return await User.findOrFail(params.id);
  }
}

module.exports = UserController;
