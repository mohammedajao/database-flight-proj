/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.post('/login', 'AuthController.login'),
Route.post('/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logout').middleware('auth')
Route.get('/ratings', 'FlightRatingsController.index')
Route.get('/flights', 'FlightsController.index')
Route.post('/flights/search', 'FlightsController.search')
Route.get('/flights/:id', 'FlightsController.show')
Route.get('/airlines', 'AirlinesController.index')
Route.get('/airports', 'AirportsController.index')
Route.post('/ratings/flight', 'FlightRatingsController.flightIndex')
Route.get('/agent/acf', 'BookingAgentsController.getAgentCustFlights')

Route.group(() => {
  Route.post('/getClients', 'PurchasesController.getClients'),
  Route.post('/create', 'PurchasesController.create'),
  Route.post('/get-tickets-thru', 'PurchasesController.getTicketsSoldInRange'),
  Route.get('/ticket-report/:airline', 'PurchasesController.getMonthlyTicketReport'),
  Route.post('/revenue-data', 'PurchasesController.revenueSources'),
  Route.get('/top-customers/:agentid', 'PurchasesController.getTopClients'),
  Route.post('/agent-commission', 'PurchasesController.getCommission'),
  Route.post('/get-spending', 'PurchasesController.getSpending'),
  Route.post('/get-monthly-spending', 'PurchasesController.getMonthlySpending')
}).prefix('/purchases').middleware('auth')

Route.group(() => {
  Route.get('/getAirline', 'StaffController.getAirlineFromStaff'),
  Route.get('/getAirplanes', 'StaffController.getAirplanesFromStaffAirline'),
  Route.get('/getTopCustomers/:airline', 'StaffController.getAirlineTopCustomers')
}).prefix('/staff').middleware('auth')


Route.group(() => {
  Route.post('/create', 'AirportsController.create'),
  Route.get('/:name', 'AirportsController.show'),
  Route.get('/get-top-airports/:airline', 'AirportsController.getTopAirports')
}).prefix('/airports').middleware('auth')

Route.group(() => {
  Route.post('/create', 'FlightsController.create'),
  Route.post('/update', 'FlightsController.update'),
  Route.post('/flight-cust-air', 'FlightsController.getFlightByCustomerAirline'),
  Route.post('/getCustomers', 'FlightsController.getCustomers')
}).prefix('/flights').middleware('auth')

Route.group(() => {
  Route.get('/:name', 'AirlinesController.show'),
  Route.post('/create', 'AirlinesController.create')
  Route.delete('/delete', 'AirlinesController.delete')
}).prefix('/airlines')

Route.group(() => {
  Route.get('/', 'AirplanesController.index'),
  Route.get('/:id', 'AirplanesController.show'),
  Route.post('/create', 'AirplanesController.create')
}).prefix('/airplanes').middleware('auth')

Route.group(() => {
  Route.post('/create', 'FlightRatingsController.create')
}).prefix('/ratings').middleware('auth')

Route.group(() => {
  Route.get('/', 'CustomersController.index'),
  Route.get('/show/:email', 'CustomersController.show')
}).prefix('/customers')

Route.group(() => {
  Route.get('/', 'BookingAgentsController.index'),
  Route.get('/top-agents/:airline', 'BookingAgentsController.topAgents')
}).prefix('/agents')