import fetch from 'node-fetch';

export async function sendOTPPhone(phone: string, otp: string) {
    const apiUrl = `https://sms.nettyfish.com/api/v2/SendSMS?SenderId=UEDCAT&Message=OTP%20for%20your%20KTEC%20-%20USTUDY%20of%20UEDUCATE%20Registration%20is%20${otp}&MobileNumbers=${phone}&TemplateId=1707174117084941425&ApiKey=%2Fd%2Ftekofpc1BcUeAz9kz2VFpDSfk1MUwQCGZgvTE7BA%3D&ClientId=a75cb3b3-7b6e-4f63-8b87-ce67790724c4`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to send OTP via SMS');
        }
    } catch (error) {
        throw new Error('Failed to send OTP via SMS: ' + error.message);
    }
}