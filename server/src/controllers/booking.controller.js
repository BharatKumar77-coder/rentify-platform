const Booking = require('../models/Booking.model');
const Equipment = require('../models/Equipment.model');
const asyncHandler = require('express-async-handler');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { equipmentId, startDate, endDate } = req.body;

  // 1. Validate Equipment exists
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  // 2. SECURITY CHECK: Prevent Self-Booking
  // If the logged-in user (req.user._id) is the OWNER of the equipment, stop them.
  if (equipment.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot book your own equipment');
  }

  // 3. The Collision Check (MongoDB Query)
  // Check if there is any booking for this item that overlaps with requested dates
  // AND is not cancelled.
  const existingBooking = await Booking.findOne({
    equipment: equipmentId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        startDate: { $lt: new Date(endDate) },
        endDate: { $gt: new Date(startDate) }
      }
    ]
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('Equipment is already booked for these dates');
  }

  // 4. Calculate Total Price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  // Prevent 0 or negative days calculation
  const rentalDays = days > 0 ? days : 1; 
  const totalAmount = rentalDays * equipment.dailyPrice;

  // 5. Create Booking
  const booking = await Booking.create({
    user: req.user._id,
    equipment: equipmentId,
    startDate,
    endDate,
    totalAmount,
    status: 'pending' 
  });

  res.status(201).json(booking);
});

// @desc    Get bookings made BY the user
// @route   GET /api/bookings/mybookings
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('equipment', 'name image dailyPrice') 
    .sort({ createdAt: -1 }); 

  res.json(bookings);
});

// @desc    Get bookings FOR the vendor's equipment
// @route   GET /api/bookings/vendor
const getVendorBookings = asyncHandler(async (req, res) => {
  // Find all equipment owned by this vendor
  const myEquipment = await Equipment.find({ owner: req.user._id });

  const equipmentIds = myEquipment.map((item) => item._id);

  // Find bookings that target these equipment IDs
  const bookings = await Booking.find({ equipment: { $in: equipmentIds } })
    .populate('user', 'name email') 
    .populate('equipment', 'name dailyPrice')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Update booking status (Approve/Reject)
// @route   PUT /api/bookings/:id
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Expect 'approved' or 'rejected'
  const booking = await Booking.findById(req.params.id).populate('equipment');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Security Check: Ensure the logged-in user OWNS the equipment being booked
  if (booking.equipment.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to manage this booking');
  }

  booking.status = status;
  await booking.save();

  res.json(booking);
});

// @desc    Cancel booking (User only)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Security Check: Ensure the logged-in user OWNS this booking
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  // Business Rule: Can only cancel if currently 'pending'
  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error('Cannot cancel booking after approval. Contact vendor.');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled successfully', booking });
});

module.exports = { 
  createBooking, 
  getMyBookings, 
  getVendorBookings, 
  updateBookingStatus, 
  cancelBooking 
};