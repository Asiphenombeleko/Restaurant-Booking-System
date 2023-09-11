export default function allInIndex(RestaurantTableBooking){
    
    async function booking(req, res){
        try {
          const tableId = req.body.tableId;
          const bookingSize = req.body.booking_size;
          const username = req.body.username;
          const phoneNumber = req.body.phone_number;
      
          // Check if the table is already booked
          const isAlreadyBooked = await RestaurantTableBooking.isTableBooked(tableId);
          
          if (isAlreadyBooked) {
            req.flash('error', 'Table is already booked.');
            res.redirect('/'); // Redirect back to the main page with an error message
          } else {
            // Book the table
            const bookingId = await RestaurantTableBooking.bookTable({
              tableName: tableId,
              username,
              contactNumber: phoneNumber,
              numberOfPeople: bookingSize,
            });
      
            req.flash('success', 'Table booked successfully!');
            res.redirect('/'); // Redirect back to the main page with a success message
          }
        } catch (error) {
          req.flash('error', 'Error booking the table.');
          res.redirect('/'); // Redirect back to the main page with an error message
        }
    }
        async function makeBookings(req, res) {
            const bookedTables = await restaurantFrontend.getBookedTables();
            res.render('bookings', { tables: bookedTables });
        
      }
      return{
        booking,
        makeBookings
      }
}