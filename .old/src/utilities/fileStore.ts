import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'otpStore.json');

interface OTPStore {
  [key: string]: {
    otp: string;
    expiresAt: number;
  };
}

// Read OTP store from file
const readOtpStore = (): OTPStore => {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Write OTP store to file
const writeOtpStore = (store: OTPStore) => {
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
};

// Function to generate and store OTP
export const generateAndStoreOTP = (key: string, otp: string, ttl: number) => {
  const store = readOtpStore();
  const expiresAt = Date.now() + ttl;
  store[key] = { otp, expiresAt };
  writeOtpStore(store);
};

// Function to verify OTP
export const verifyOTP = (key: string, otp: string): boolean => {
  const store = readOtpStore();
  const otpData = store[key];

  if (!otpData) {
    return false;
  }

  const currentTime = Date.now();

  if (currentTime > otpData.expiresAt) {
    delete store[key];
    writeOtpStore(store);
    return false;
  }

  if (otpData.otp !== otp) {
    return false;
  }

  // OTP is valid
  delete store[key]; // Remove OTP after successful verification
  writeOtpStore(store);
  return true;
};