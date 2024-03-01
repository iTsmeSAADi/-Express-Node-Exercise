const moment = require('moment');
const { User } = require('../models/User.Model');

const createUser = async (req, res) => {
  try {
    const { name, phone_number } = req.body;

    // Create a user using Sequelize
    const user = await User.create({ name, phone_number });

    res.status(200).json({ success: true, message: 'USER CREATED SUCCESSFULLY', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'INTERNAL SERVER ERROR' });
  }
};

async function generateOTP(req, res) {
    try {
      const { phone_number } = req.body;
  
      // Validate that 'phone_number' is not null or undefined
      if (!phone_number) {
        return res.status(400).json({ success: false, error: 'PHONE NUMBER IS REQUIRED' });
      }
  
      // Generate a random 4-digit numeric OTP
      const otp = Math.floor(1000 + Math.random() * 9000);
  
      // Set expiration date to 5 minutes in the future using moment
      const expirationDate = moment().add(5, 'minutes');
  
      // Update the existing user with the generated OTP and expiration date
      const updatedUser = await User.update(
        { otp, otp_expiration_date: expirationDate.toDate() },
        { where: { phone_number } }
      );
  
      if (updatedUser[0] === 0) {
        return res.status(404).json({ success: false, error: 'USER NOT FOUND' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'OTP GENERATED SUCCESSFULLY',
        phone_number,
        otp,
        expiration_date: expirationDate.format(), // Format the expiration date
      });
    } catch (error) {
      // Handle other errors
      console.error(error);
      return res.status(500).json({ success: false, error: 'INTERNAL SERVER ERROR' });
    }
  }
  

const verifyOTP = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { otp } = req.query;

    // Find user by ID
    const user = await User.findByPk(user_id);

    // Check if user and OTP exist and are not expired
    if (user && user.otp === otp && user.otp_expiration_date > new Date()) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(400).json({ success: false, error: 'INCORRECT OTP OR OTP HAS EXPIRED' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'INTERNAL SERVER ERROR' });
  }
};

module.exports = { createUser, generateOTP, verifyOTP };
