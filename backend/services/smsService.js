// smsService.js
require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSms = (to, body) => {
  return client.messages.create({
    body: body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to,
  });
};

module.exports = { sendSms };
