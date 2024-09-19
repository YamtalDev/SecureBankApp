import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Otp from '../models/Otp';
import { sendOtpSms } from '../services/smsService';

export const signUp = async (req: Request, res: Response) => {
  const { email, password, phoneNumber } = req.body;

  // Validate inputs here

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      phoneNumber,
      balance: Math.floor(Math.random() * 10000), // Random initial balance
    });

    await user.save();

    // Generate OTP and save
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = new Otp({
      userId: user._id,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60000), // Expires in 10 minutes
    });
    await otp.save();

    // Send OTP via SMS
    await sendOtpSms(user.phoneNumber, otpCode);

    res.status(201).json({ message: 'User registered. Please verify your phone number.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Implement signIn and verifyPhone similarly
