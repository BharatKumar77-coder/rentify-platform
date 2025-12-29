const Booking = require('../models/Booking.model');
const Equipment = require('../models/Equipment.model');
const asyncHandler = require('express-async-handler');

//Create new booking
const createBooking = asyncHandler(async (req, res) => {
  const { equipmentId, startDate, endDate } = req.body;

  //Validate Equipment exists
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  // The Collision Check (MongoDB Query)
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

  //Calculate Total Price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalAmount = days * equipment.dailyPrice;

  //Create Booking
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

const getMyBookings = asyncHandler(async (req, res) => {
  // Find bookings where user matches req.user._id
  const bookings = await Booking.find({ user: req.user._id })
    .populate('equipment', 'name image dailyPrice') 
    .sort({ createdAt: -1 }); 

  res.json(bookings);
});

const getVendorBookings = asyncHandler(async (req, res) => {
  //Find all equipment owned by this vendor
  const myEquipment = await Equipment.find({ owner: req.user._id });

  const equipmentIds = myEquipment.map((item) => item._id);

  const bookings = await Booking.find({ equipment: { $in: equipmentIds } })
    .populate('user', 'name email') 
    .populate('equipment', 'name dailyPrice')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// Update booking status (Approve/Reject)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; 
  const booking = await Booking.findById(req.params.id).populate('equipment');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

// Ensure the logged-in user OWNS the equipment being booked
  if (booking.equipment.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to manage this booking');
  }

  booking.status = status;
  await booking.save();

  res.json(booking);
});


//Cancel booking (User only)
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error('Cannot cancel booking after approval. Contact vendor.');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled successfully', booking });
});

module.exports = { createBooking, getMyBookings, getVendorBookings, updateBookingStatus, cancelBooking };