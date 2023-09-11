import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import createRestaurantFrontend from "./services/restaurant.js"; //
import restaurant from "./db/dbLogic.js";
import indexRoutes from "./routes/index_routes.js"
import db from './connection.js'


const app = express()

const RestaurantTableBooking = restaurant(db);
const restaurantFrontend = createRestaurantFrontend(RestaurantTableBooking);

const index_route = indexRoutes(RestaurantTableBooking)
app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get("/", (req, res) => {

    res.render('index', { tables : [{}, {}, {booked : true}, {}, {}, {}]})
});
//create the book route to be able to book a table
app.post('/book', index_route.booking);

app.get("/bookings", index_route.makeBookings)


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});