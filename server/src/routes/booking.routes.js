const express = require('express');
const router = express.Router();
const { createBooking,
    getMyBookings,
    getVendorBookings,
    updateBookingStatus,
    cancelBooking
} = require('../controllers/booking.controller');
const { protect, vendor } = require('../middlewares/auth.middleware');


router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/vendor', protect, vendor, getVendorBookings);
router.put('/:id', protect, vendor, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;