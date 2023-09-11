const restaurant = (db) => {
    async function getTables() {
      // get all the available tables
      let allTables = await db.manyOrNone("SELECT * FROM table_booking");
      return allTables;
    }
  
    // Function to book a table
    async function bookTable({ tableName, username, contact_number, number_of_people }) {
      const result = await db.one(
        `
        UPDATE ${table_booking.tableName}
        SET username = $2, contact_number = $3, number_of_people = $4
        WHERE table_name = $1
        RETURNING id
        `,
        [tableName, username, contact_number, number_of_people]
      );
      return { bookingId: result.id };
    }
  // get all the booked tables
    async function getBookedTables(tableName) {
  
      let result = await db.any('SELECT * FROM table_booking WHERE booked = true')
      return result
    }
   
    // Function to check if a table is already booked
    async function isTableBooked(tableName) {
      try {
        const result = await db.oneOrNone(
          `
          SELECT id
          FROM ${table_booking.tableName}
          WHERE table_name = $1
          `,
          [tableName]
        );
        return result !== null;
      } catch (error) {
        return false;
      }
    }
  
    async function cancelTableBooking(tableName) {
  
      // cancel a table by name
      await db.any('DELETE FROM table_booking WHERE table_name = $1',[tableName])
    }
  
    async function getBookedTablesForUser(username) {
       // get user table booking
     let results =  await db.oneOrNone('SELECT * FROM table_booking WHERE username = $1',[username])
     return results
    }
  
    return {
      getTables,
      bookTable,
      getBookedTables,
      isTableBooked,
      cancelTableBooking,
      getBookedTablesForUser,
    };
  };
  
  export default restaurant;
  