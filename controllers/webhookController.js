const asyncHandler = require("express-async-handler");
const stripe = require("../db/stripe");
const { markOrderAsPaid } = require("../models/orderModel");

const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    //  console.log("Webhook body (raw):", req.body.toString());
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      await markOrderAsPaid(orderId);
    } catch (error) {
      console.error("DB error updating order:", error);
    }
  }

  res.status(200).json({ received: true });
});


module.exports={
    stripeWebhook,
    
}