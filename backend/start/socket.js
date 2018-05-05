const Ws = use('Ws');

Ws.channel('leaguePlayer', 'LeaguePlayerUpdateController');
Ws.channel('draftOrder', 'DraftOrderWsController');
  // .middleware(['auth']);