const { setDoneInvoiceService } = require("../services/invoiceService");

const createPaymaentUrl = async(req, res)=>{
  const { userId, invoiceId, amount, name } = req.body;
  const YOUR_DOMAIN = process.env.DOMAIN;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: amount,
    description: name+" thanh toan",
    infor: {
      userId: userId,
      invoiceId: invoiceId,
    },
    returnUrl: `${YOUR_DOMAIN}`,
    cancelUrl: `${YOUR_DOMAIN}`,
    expiredAt: Math.floor((Date.now() + 300000)/1000)
  };

  try {
      const url = await createLinkService(body);
      res.send(url);
  } catch (error) {
      console.log(error);
      return null;
  }
}

const onStatusPayment = async (req, res) =>{
  const webhookData = req.body; 
  const orderCode = webhookData.data.orderCode; 
  const status = webhookData.desc;  

  console.log(webhookData);
  const isValid = isValidData(webhookData.data, webhookData.signature, process.env.PAYOS_CHECKSUM_KEY);

  if (!isValid) {
      console.log("Webhook signature verification failed");
      return res.status(400).send("Invalid signature");
  }

  if (status === "success") {
      const res = await setDoneInvoiceService(orderCode);
      // await setDoneBillService(orderCode);

      // const data = {
      //     name: webhookData.data.counterAccountName,
      //     numAccount: webhookData.data.counterAccountNumber,
      //     infor: webhookData.data.description,
      //     time: webhookData.data.transactionDateTime,
      //     amount: webhookData.data.amount,
      // }
      // if(res.modifiedCount === 0) await createOverTimeService(data);
      // else{
      //     const bill = await getBill(orderCode);
      //     await sendemail(bill);
      // }

  } else {
      console.log(`Giao dịch ${orderCode} thất bại`);
  }

  res.status(200).send("Received successfully");
}

module.exports ={
  createPaymaentUrl, onStatusPayment
}