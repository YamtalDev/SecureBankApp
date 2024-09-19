import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const client = twilio(accountSid, authToken);

export const sendOtpSms = async (phoneNumber: string, otpCode: string) => {
  try {
    await client.messages.create({
      body: `Your verification code is ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw error;
  }
};
