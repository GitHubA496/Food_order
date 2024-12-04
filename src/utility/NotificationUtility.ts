export const GenerateOTP = () =>
{
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date()
    expiry.setTime(new Date().getTime() +(30*60*1000));
    return {otp,expiry};
}

export const OnRequestOTP = async (opt: number , toPhoneNumber:string) => {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const result = await client.messages
    .create({
        body: `Your OTP is ${opt}`,
        from: process.env.TWILIO_PHONE,
        to: '+91'+toPhoneNumber
    });

}