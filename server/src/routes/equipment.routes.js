const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment.model');
const { protect, vendor } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadOnCloudinary } = require('../utils/cloudinary');

//Create new equipment
router.post('/', protect, vendor, upload.single('image'), async (req, res) => {
  try {
    //Check if file exists
    if (!req.file) {
       return res.status(400).json({ message: 'Image is required' });
    }

    //Upload to Cloudinary
    const imageUrl = await uploadOnCloudinary(req.file.path);

    if (!imageUrl) {
       return res.status(500).json({ message: 'Image upload failed' });
    }

    //Create Item with the Cloudinary URL
    const item = await Equipment.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      dailyPrice: Number(req.body.dailyPrice),
      image: imageUrl, 
      owner: req.user._id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

//Get All Equipment
router.get('/', async (req, res) => {
  try {
    //Filter by Name or Category
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } }, 
            { category: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};


    //Check if ?sort=low or ?sort=high
    let sortOption = { createdAt: -1 }; // Default: Newest first
    
    if (req.query.sort === 'low') {
      sortOption = { dailyPrice: 1 }; 
    } else if (req.query.sort === 'high') {
      sortOption = { dailyPrice: -1 }; 
    }

    // execute query with search keyword and sort option
    const items = await Equipment.find({ ...keyword }).sort(sortOption).populate('owner', 'name');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Vendor Only: Create Equipment
router.post('/', protect, vendor, async (req, res) => {
    try {
        const item = await Equipment.create({
            ...req.body,
            owner: req.user._id 
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Vendor Only: Get "My Items"
router.get('/myitems', protect, vendor, async (req, res) => {
  try {
    // Find items where 'owner' matches the logged-in user's ID
    const items = await Equipment.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Item (Vendor only, and must own the item)
router.delete('/:id', protect, vendor, async (req, res) => {
  const item = await Equipment.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  //Ensure logged-in user is the owner
  if (item.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this item');
  }

  await item.deleteOne();
  res.json({ message: 'Item removed' });
});

module.exports = router;