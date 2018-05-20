'use strict'
const User = use ('App/Models/User');
const Hash = use ('Hash');

class UserController {
  async login({request, auth}) {
    const { email, password } = request.all();
    return await auth.attempt(email, password);
  }

  async getUser({params}) {
    return await User.findOrFail(params.id);
  }

  async getUserId({auth}) {
    return auth.user.id;
  }

  async updateEmailStatus({request, auth}) {
    const body = request.post();

    try {
      let updateUser = await User.find(auth.user.id);
      updateUser.send_emails = body.sendEmails;
      updateUser.save();
    } catch(e) {
      return 'Error updating email status';
    }
  }

  async updatePassword({request, auth}) {
    const body = request.post();

    try {
      let resetUser = await User.find(auth.user.id);
      resetUser.password = await Hash.make(body.password);
      resetUser.save();
    } catch(e) {
      return 'Error resetting password';
    }
  }

  async createUser({request, response}) {
    const body = request.post();
    try {
      let user = new User();

      if(body.inviteCode !== 'fdpinvitegroup') {
        response.status(400);
        return "The invite code you have supplied is not valid";
      } else {
        user.username = body.email;
        user.password = body.password;
        user.email = body.email;

        await user.save();
      }
    } catch(e) {
      if(e.code === 'ER_DUP_ENTRY') {
        response.status(500);
        console.log(e);
        return `Error: Email ${body.email} is already used.`;
      } else {
        return 'Unknown error occurred'
      }
    }
  }
}

module.exports = UserController;
