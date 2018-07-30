const DraftOrder = use('App/Models/DraftOrder');
const Mailservice = require('./MailService').MailService;

class Helpers {
  static getNextOnClock(leagueId) {
    return DraftOrder.query()
      .with('team')
      .with('team.user')
      .whereRaw('player_selected_id is null')
      .andWhereRaw('(end_time > CURRENT_TIMESTAMP() OR end_time is null)')
      .andWhere('league_id', '=', leagueId)
      .orderBy('pick_number')
      .first();
  }


  static async sendNextUpEmail(leagueId) {
    try {

      let nextUp = await Helpers.getNextOnClock(leagueId);
      const nextUpJson = nextUp.toJSON();

      //dont send emails if unsubscribed.
      if(nextUpJson.team.user.send_emails === 0) {
        console.log('not sending email');
        return;
      }

      const currentUp = await DraftOrder.query()
        .with('team')
        .with('leaguePlayer')
        .with('leaguePlayer.player')
        .whereRaw('player_selected_id is not null')
        .andWhere('league_id', '=', leagueId)
        .orderBy('pick_number', 'desc')
        .first();

      const currentUpJson = currentUp.toJSON();

      const subject = `Your team: ${nextUpJson.team.name} has been placed on the clock`;
      // $body = "Your team: $teamName has been placed on the clock as of $time EST with pick number: $pickNumber. Please login to https://fantasydraftplus.com in order to make your pick.";
      // $body .= "\n\nIf you do not select a player within the 24 hour period then your pick will be forfeit.";
      // $body .= "\n\n$player was selected before you by " . $order->getTeam()->getName();
      const message = `
      Your team: ${nextUpJson.team.name} has been on the clock as of ${nextUpJson.start_time} EST with pick number: ${nextUpJson.pick_number}.
      Please login to http://fantasydraftplus.net in order to make your pick.

      If you do not select a player within the 24 hour period then your pick will be move to the next person. You may contact popeseveni@gmail.com or buphmin@gmail.com
      to ask for your pick to be filled in out of order.

      ${currentUpJson.leaguePlayer.player.name} was selected before you by ${currentUpJson.team.name}
      `;

      const mailService = new Mailservice();

      mailService.sendEmail(nextUpJson.team.user.email, subject, message, true);
    } catch(e) {
      console.log('er', e);
    }

  }
}

module.exports = Helpers;