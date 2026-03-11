// Final Production Build - CAPI Integration Complete
import crypto from "crypto";
import axios from "axios";

// Meta CAPI Config
const PIXEL_ID = process.env.PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.TEST_EVENT_CODE;

const hashData = (data) => {
  if (!data || typeof data !== "string") return null;
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
};

const fireMetaCAPIEvent = async (eventName, userData, customData) => {
  if (!PIXEL_ID || !META_ACCESS_TOKEN) {
    console.error(`[CAPI Webhook] Skipping: Missing PIXEL_ID (${!!PIXEL_ID}) or META_ACCESS_TOKEN (${!!META_ACCESS_TOKEN})`);
    return;
  }
  try {
    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: customData.event_id,
        user_data: {
          em: userData.email ? [hashData(userData.email)] : [],
          ph: userData.phone ? [hashData(userData.phone)] : [],
          fn: userData.firstName ? [hashData(userData.firstName)] : [],
          client_user_agent: userData.userAgent,
          client_ip_address: userData.ip,
        },
        custom_data: {
          value: customData.value,
          currency: "NGN",
          content_ids: [customData.productId],
          content_type: "product",
        },
      }],
      test_event_code: TEST_EVENT_CODE || undefined,
    };
    await axios.post(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, payload);
    console.log(`[CAPI Webhook] Success for ${customData.event_id}`);
  } catch (error) {
    console.error("[CAPI Webhook] Error:", error.response?.data || error.message);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const signature = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // LOGGING: This will appear in your Vercel logs
  console.log("Webhook Received. Signature present:", !!signature);

  // We check the event first
  const { event, data } = req.body;

  if (event === "charge.success") {
    console.log("Payment Success Event for Ref:", data.reference);

    const { reference, metadata, amount, customer, ip_address } = data;
    const firstName = metadata?.customer_name?.split(" ")[0] || customer?.first_name;

    await fireMetaCAPIEvent(
      "Purchase",
      {
        email: customer?.email,
        phone: metadata?.customer_phone || customer?.phone,
        firstName: firstName,
        userAgent: req.headers["user-agent"],
        ip: ip_address || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      },
      {
        value: amount / 100,
        productId: metadata?.product,
        event_id: reference,
      }
    );
  }

  res.status(200).send("OK");
}
