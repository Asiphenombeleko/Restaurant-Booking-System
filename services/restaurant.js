const createRestaurantFrontend = (database) => {
    // Function to get all available tables
    async function getAllTables() {
      try {
        const tables = await database.getTables();
        return tables;
      } catch (error) {
        throw error;
      }
    }
  
    // Function to book a table
    async function bookTable({ tableName, username, contactNumber, numberOfPeople }) {
      try {
        const result = await database.bookTable({
          tableName,
          username,
          contact_number: contactNumber,
          number_of_people: numberOfPeople,
        });
        return result.bookingId;
      } catch (error) {
        throw error;
      }
    }
  
    // Function to get all booked tables
    async function getBookedTables() {
      try {
        const bookedTables = await database.getBookedTables();
        return bookedTables;
      } catch (error) {
        throw error;
      }
    }
  
    // Function to check if a table is already booked
    async function isTableBooked(tableName) {
      try {
        const isBooked = await database.isTableBooked(tableName);
        return isBooked;
      } catch (error) {
        throw error;
      }
    }
  
    // Function to cancel a table booking
    async function cancelTableBooking(tableName) {
      try {
        await database.cancelTableBooking(tableName);
      } catch (error) {
        throw error;
      }
    }
  
    // Function to get booked tables for a user
    async function getBookedTablesForUser(username) {
      try {
        const userBookings = await database.getBookedTablesForUser(username);
        return userBookings;
      } catch (error) {
        throw error;
      }
    }
  
    return {
      getAllTables,
      bookTable,
      getBookedTables,
      isTableBooked,
      cancelTableBooking,
      getBookedTablesForUser,
    };
  };
  
  export default createRestaurantFrontend;