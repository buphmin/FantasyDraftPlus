'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route');
const Database = use('Database');
const User = use ('App/Models/User');

Route.post('/login', 'UserController.login');

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
});


Route.get('/leagues', 'LeagueController.getLeagues').middleware('auth');
Route.get('/leagues/all', 'LeagueController.getAllLeagues').middleware('auth');
Route.get('/leagues/:id', 'LeagueController.getLeague').middleware('auth');
Route.get('/leagues/:league/league-players', 'LeaguePlayerController.getLeaguePlayers').middleware('auth');
Route.put('/leagues/:league/league-players/:id', 'LeaguePlayerController.updateLeaguePlayer').middleware('auth');
Route.get('/players', 'PlayerController.getPlayers').middleware('auth');
Route.get('/teams', 'TeamController.getTeams').middleware('auth');
Route.get('/teams/:id', 'TeamController.getTeam').middleware('auth');
Route.get('/users/:id', 'UserController.getUser').middleware('auth');
Route.get('/getUserId', 'UserController.getUserId').middleware('auth');
Route.post('/users', 'UserController.createUser');
Route.post('/users/reset-password', 'UserController.updatePassword').middleware('auth');
Route.post('/users/update-emails', 'UserController.updateEmailStatus').middleware('auth');
Route.get('/leagues/:league/draft-order', 'DraftOrderController.getDraftOrders').middleware('auth');
Route.get('/admin/send-next-up-email/:leagueId', 'AdminController.sendNextOnClockEmail').middleware('auth');
Route.get('/admin/league/:league/:leaguePlayer', 'AdminController.updateLeaguePlayer').middleware('auth');

