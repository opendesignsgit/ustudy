interface OTPStore {
  [key: string]: {
    otp: string;
    expiresAt: number;
  };
}

// In-memory OTP storage
const otpStore: OTPStore = {};

// Function to generate and store OTP
export const generateAndStoreOTP = (key: string, otp: string, ttl: number) => {
  const expiresAt = Date.now() + ttl;
  otpStore[key] = { otp, expiresAt };
};

// Function to verify OTP
export const verifyOTP = (key: string, otp: string): boolean => {
  const otpData = otpStore[key];

  if (!otpData) {
    return false;
  }

  const currentTime = Date.now();

  if (currentTime > otpData.expiresAt) {
    delete otpStore[key];
    return false;
  }

  if (otpData.otp !== otp) {
    return false;
  }

  // OTP is valid
  delete otpStore[key]; // Remove OTP after successful verification
  return true;
};