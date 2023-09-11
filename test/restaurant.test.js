import assert from "assert"
import RestaurantTableBooking from "../services/restaurant.js";
import pgPromise from 'pg-promise';
import { log } from "console";

const DATABASE_URL = 'postgresql://codex:xcode123@localhost:5432/projectdb';

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

const restaurantTableBooking = RestaurantTableBooking(db);


//  This test case checks if the getTables function returns an array of available tables. It expects an array with five empty objects as the result.
describe("The restaurant booking table", function () {
    this.timeout(20000)
    const restaurantTableBooking = RestaurantTableBooking(db);

    beforeEach(async function () {
        try {
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE table_booking RESTART IDENTITY CASCADE;");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table one', 4, false);")
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table two', 6, false);")
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table three', 4, false);")
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table four', 2, false);")
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table five', 6, false);")
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table six', 4, false);")
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Get all the available tables", async function () {


        const tables = await restaurantTableBooking.getTables();
        console.log(await restaurantTableBooking.getTables()
        );

        assert.deepEqual([
            {
              id: 1,
              table_name: 'Table one',
              capacity: 4,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            },
            {
              id: 2,
              table_name: 'Table two',
              capacity: 6,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            },
            {
              id: 3,
              table_name: 'Table three',
              capacity: 4,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            },
            {
              id: 4,
              table_name: 'Table four',
              capacity: 2,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            },
            {
              id: 5,
              table_name: 'Table five',
              capacity: 6,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            },
            {
              id: 6,
              table_name: 'Table six',
              capacity: 4,
              booked: false,
              username: null,
              number_of_people: null,
              contact_number: null
            }
          ], tables);
    });

    // This test case checks if the system correctly prevents booking a table with a capacity greater than the available seats. It expects the result to be "capacity greater than the table seats."

    it("It should check if the capacity is not greater than the available seats.", async function () {

        
        const result = await restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 3
        });

        assert.deepEqual( result);
    });

    it("should check if there are available seats for a booking.", async function () {
        const availableSeats = 4;
        // loop over the tables and see if there is a table that is not booked
        const result = await restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: availableSeats
        });

        // get all the tables

        assert.deepEqual(true, result);
    });

    it("Check if the booking has a user name provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual("Please enter a username", await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            phoneNumber: '084 009 8910',
            seats: 2
        }));
    });

    it("Check if the booking has a contact number provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual("Please enter a contact number", await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            username: 'Kim',
            seats: 2
        }));
    });

    it("should not be able to book a table with an invalid table name.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table eight',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        assert.deepEqual("Invalid table name provided", message);
    });

    it("should be able to book a table.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        // Table three should not be booked
        assert.equal(true, await restaurantTableBooking.isTableBooked('Table three'));
        // book Table three

        await restaurantTableBooking.bookTable({
            tableName: 'Table three',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        // Table three should be booked now
        const booked = await restaurantTableBooking.isTableBooked('Table three')
        assert.equal(true, booked);
    });

    it("should list all booked tables.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        let tables = await restaurantTableBooking.getTables();
        assert.deepEqual(6, tables.length);
    });

    it("should allow users to book tables", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser('jodie'));

        restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        })

        // should only return 2 bookings as two of the bookings were for the same table
        assert.deepEqual([{}, {}], await restaurantTableBooking.getBookedTablesForUser('jodie'));
    });

    it("should be able to cancel a table booking", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        let bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(2, bookedTables.length);

        await restaurantTableBooking.cancelTableBooking("Table four");

        bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(1, bookedTables.length);
    });

    after(function () {
        db.$pool.end;
    });
})
