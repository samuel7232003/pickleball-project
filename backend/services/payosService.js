require('dotenv').config();
const PayOS = require("@payos/node");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const createLinkService = async(body) => {
  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    return paymentLinkResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
}


module.exports = {
    createLinkService
}