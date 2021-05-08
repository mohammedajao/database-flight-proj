# Project Report
https://docs.google.com/document/d/1HEutRUFd4MEe-Y5FnLkz_8fBD2nnyQLhB7UKNL5leUw/edit?usp=sharing

Also is a PDF inside the /misc folder. Please check the /misc folder for the database backup files.
The relational sketch diagram is formatted incorrectly in terms of attribute links due to time constraints. However, it does give a general outline of the database and its tables along with the the logical flow.

## Queries

Queries with multiple lines or that lack clarity will have their own heading.

### Airline Queries
Airline.all()
Airline.query().where({ name: params.name }).firstOrFail()
Airline.create({ name: fixedName })

#### Airline Deletion
const airline = await Airline.query().where({ name }).firstOrFail()
const deleted = await airline.delete()

### Airplane Queries
Airplane.all()

#### Airplane Creation
const airline = await Airline.query().where({ name: airline_name }).firstOrFail()
const airplane = await Airplane.create({
    owned_by: airline.name,
    seats
})
Airline.query().where({ name: airlineName }).firstOrFail()

#### Airlplane Show
Airplane.query().where({ id: params.id }).firstOrFail()

### Airport Queries
Airport.query().where({ name: params.name }).firstOrFail()
Airport.create({ name, city })
Airport.all()

#### Top Airports
Database.rawQuery('SELECT city, r.freq FROM Airports AS ap, (SELECT arrival_airport, owned_by, COUNT(*) AS freq FROM Flights INNER JOIN Has ON Flights.id = Has.flight_id GROUP BY arrival_airport, owned_by) AS r WHERE r.owned_by = ? AND ap.name = r.arrival_airport ORDER BY r.freq DESC LIMIT 3', [airline])

### Authentication Queries
Customer.query().where({ user_email: email }).firstOrFail()
BookingAgent.query().where({ user_email: email }).firstOrFail()

#### Searching for staff and grabbing their extra data
Staff.query().where({ user_email: email }).firstOrFail()
WorksFor.query().where({ staff_email: staff.user_email }).firstOrFail()

#### Create Customer
Customer.create({
    user_email: user.email,
    building_num: validCustomerData.building_num,
    street: validCustomerData.street,
    city: validCustomerData.city,
    passport_exp_date: validCustomerData.passport_exp_date,
    passport_num: validCustomerData.passport_num,
    dob: validCustomerData.dob
})

### Booking Agent Queries
BookingAgent.all()

#### Booking Agent create
BookingAgent.create({
    user_email: user.email,
    agent_id: validAgentData.agent_id
})

#### Get Year's Top Agents
Database.rawQuery('SELECT agent_id, m.ticketsSold FROM BookingAgents AS ba, (SELECT COUNT(*) AS ticketsSold, purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT id FROM Purchases AS pes WHERE YEAR(pes.created_at) > YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) AND ps.purchaser_email IN (SELECT user_email FROM BookingAgents) AND ps.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) GROUP BY purchaser_email) AS m WHERE m.purchaser_email = ba.user_email ORDER BY m.ticketsSold DESC', [airline])

#### Get Monthly Top Agents
Database.rawQuery('SELECT agent_id, m.ticketsSold FROM BookingAgents AS ba, (SELECT COUNT(*) AS ticketsSold, purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT id FROM Purchases AS pes WHERE MONTH(pes.created_at) > MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) AND ps.purchaser_email IN (SELECT user_email FROM BookingAgents) AND ps.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) GROUP BY purchaser_email) AS m WHERE m.purchaser_email = ba.user_email ORDER BY m.ticketsSold DESC', airline)

#### Get agent's client's flights
Database.rawQuery('SELECT * FROM Flights AS f, (SELECT purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT cd.purchased_for FROM PurchaseSources AS cd WHERE cd.purchaser_email = ?)) AS clients WHERE f.id IN (SELECT flight_num FROM Purchases AS p WHERE p.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email = clients.purchaser_email AND pes.type = 2))', [email])

### Ratings Queries
Rate.query().where({ flight_id: flight.id })

#### Create
Rate.create({
   customer_email: email,
   flight_id,
   rating: rate,
   comment
})

#### Get ratings by Airline
Database.rawQuery('SELET * FROM FlightRatings as fr WHERE fr.flight_id IN (Select * FROM Uses WHERE  Uses.airline_name = ?)', airline_name)


### Flight Queries
 Flight.query().where('depart_date_time', '>', currentDate)
 Flight.query().where({ id: validData.flight_id }).firstOrFail()

#### Search
 flightOutput.where('depart_date_time', '>', depart_date_time)
 .andWhere('arrival_date_time', '<', arrival_date_time )
  .andWhere({ arrival_airport })
     .andWhere({ departure_airport })

Database.rawQuery("SELECT id, departure_airport FROM Flights AS f WHERE f.departure_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", departure_city)

     flightOutput.andWhereIn(['id', 'departure_airport'], departFlights)

     Database.rawQuery("SELECT id, arrival_airport FROM Flights AS f WHERE f.arrival_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", arrival_city)

    flightOutput.andWhereIn(['id', 'departure_airport'], arrivalFlights)

#### Create
Flight.create({
    owned_by: airline.name,
    flight_num: validData.flight_num,
    base_price: validData.base_price,
    depart_date_time: validData.depart_date_time,
    departure_airport: departureAirport.name,
    arrival_date_time: validData.arrival_date_time,
    arrival_airport: validData.arrival_airport,
    type: validData.type,
    status: validData.status
})

Use.create({
    airline_name: airline.name,
    airplane_id: airplane.id,
    flight_id: flight.id
})

#### Flight by Customer & Airline
Database.rawQuery('select * FROM `Flights` as f, (select `flight_id` from `PurchaseSources` where `purchaser_email` = ? and `flight_id` in (select `flight_id` from `Uses` where `airline_name` = ?)) as fis WHERE f.id = fis.flight_id', [validData.email, validData.airline])


#### Get customers
Flight.query().where({ id: data.flight_id, owned_by: data.airline }).firstOrFail()
PurchaseSource.query().where({ flight_id: flight.id }).select('purchaser_email')
Customer.query().whereIn(['user_email'], purchaseSources)


### Purchases

#### Creation

Purchase.create({
    price: price,
    flight_num: flight.id,
    credit_card_exp_date: data.creditCardExpDate,
    credit_card_num: data.creditCardNum
})

PurchaseSource.create({
    purchaser_email: user.email,
    purchase_id: purchase.id,
    purchased_for: data.purchaseFor || purchase.id,
    flight_id: flight.id,
    type: data.type
})

AgentPurchase.create({
    purchase_id: purchase.id,
    ba_agent_id: agent.agent_id,
    commission: 0
})

Ticket.create({
    base_price: flight.base_price
})

Has.create({
    ticket_id: ticket.id,
    flight_id: flight.id
})

ProductPurchase.create({
    purchase_id: purchase.id,
    ticket_id: ticket.id
})

#### Get Amount Sold In Range
Database.rawQuery('Select COUNT(id) AS ticketsSold FROM Purchases WHERE id in (SELECT purchase_id FROM ProductPurchases)  AND flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)  AND created_at >= ? AND created_at <= ? ', [validData.airline, validData.startDate.toISODate(), validData.endDate.toISODate()])

#### Get Year and Month Report of Ticket Sale Performance
Database.rawQuery('Select YEAR(created_at) AS yearSold, MONTH(created_at) as monthSold, COUNT(id) AS ticketsSold FROM Purchases WHERE id in (SELECT purchase_id FROM ProductPurchases)  AND flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)  AND created_at >= ? AND created_at <= ? GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)', [validData.airline, validData.startDate.toISODate(), validData.endDate.toISODate()])

#### Monthly Ticket report
Database.rawQuery('SELECT YEAR(created_at) AS yearSold, MONTH(created_at) as monthSold, COUNT(id) AS TOTALCOUNT FROM Purchases WHERE flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?) GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)', airline)

#### Get direct revenue
Database.rawQuery('SELECT SUM(ps.price) AS revenue FROM Purchases AS ps WHERE ps.created_at > ? AND ps.id IN (SELECT pp.purchase_id FROM ProductPurchases AS pp) AND ps.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email IN (SELECT c.user_email FROM Customers AS c)) AND ps.flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)', [validData.startDate.toISODate(), validData.airline])

#### Get indirect revenue
Database.rawQuery('SELECT SUM(ps.price) AS revenue FROM Purchases AS ps WHERE ps.created_at > ? AND ps.id IN (SELECT pp.purchase_id FROM ProductPurchases AS pp) AND ps.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email IN (SELECT c.user_email FROM BookingAgents AS c)) AND ps.flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)', [validData.startDate.toISODate(), validData.airline])

#### Get Top Customers 6 Months
Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHBOUGHT, ps.purchaser_email, COUNT(p.id) AS AMOUNT FROM Purchases AS p, PurchaseSources AS ps WHERE MONTH(p.created_at) >= MONTH(NOW()) - 6 AND ps.purchase_id IN (SELECT ap.purchase_id FROM AgentPurchases AS ap WHERE ap.ba_agent_id = ?) GROUP BY MONTHBOUGHT, ps.purchaser_email ORDER BY AMOUNT DESC LIMIT 5', agentid)

#### Get top customers in commission for the year
Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHBOUGHT, ps.purchaser_email, SUM(ap.commission) AS AMOUNT FROM AgentPurchases AS ap, Purchases AS p, PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT app.purchase_id FROM AgentPurchases AS app WHERE app.ba_agent_id = ?) AND ps.purchase_id IN (SELECT p.id FROM Purchases AS p WHERE YEAR(p.created_at) >= YEAR(NOW())) GROUP BY MONTHBOUGHT, ps.purchaser_email ORDER BY AMOUNT DESC', agentid)

#### Get Agent Commission
Database.rawQuery('SELECT SUM(ap.commission) AS TOTALCOMMISSION FROM AgentPurchases AS ap WHERE ap.ba_agent_id=? AND ap.purchase_id IN (SELECT p.id FROM Purchases AS p WHERE p.created_at >= ?)', [validData.agent_id, validData.startDate.toISODate()])

#### Get agent's tickets sold
Database.rawQuery('SELECT COUNT(pp.id) AS TICKETSSOLD FROM ProductPurchases AS pp WHERE pp.purchase_id IN (SELECT mp.id FROM Purchases AS mp WHERE mp.created_at >= ?) AND pp.purchase_id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email IN (SELECT ba.user_email FROM BookingAgents AS ba WHERE ba.agent_id = ?))', [validData.startDate.toISODate(), validData.agent_id])

#### Get customer spending
Database.rawQuery('SELECT SUM(p.price) AS AMOUNT FROM Purchases AS p WHERE p.id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email = ?) AND p.created_at >= ? AND p.created_at <= ?', [validData.email, validData.startDate.toISODate(), validData.endDate.toISODate()])

#### Get monthly customer spending
Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHWORK, SUM(p.price) AS AMOUNT FROM Purchases AS p WHERE MONTH(p.created_at) > MONTH(NOW()) - 6 AND p.id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email = ?) GROUP BY MONTHWORK ORDER BY AMOUNT DESC', [validData.email])


### Staff

#### Get airplanes from airline
Staff.query().where({ user_email: user.email }).firstOrFail()
WorksFor.query().where({ staff_email: staff.user_email }).firstOrFail()
Airline.query().where({ name: worksFor.airline_name }).firstOrFail()
Airplane.query().where({ owned_by: airline.name })


#### Top Airline Customers
Database.rawQuery('SELECT COUNT(purchaser_email) AS freq, purchaser_email FROM PurchaseSources as d WHERE d.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) AND d.purchaser_email IN (SELECT user_email FROM Customers as c WHERE c.user_email = d.purchaser_email) AND d.purchase_id IN (SELECT id FROM Purchases as pes WHERE pes.id = d.purchase_id AND YEAR(pes.created_at) > YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) GROUP BY purchaser_email ORDER BY freq DESC', airline)
