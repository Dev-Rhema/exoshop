import crypto from "crypto";
import axios from "axios";

// Meta CAPI Config
const PIXEL_ID = process.env.PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.TEST_EVENT_CODE;

// Helper to hash data for Meta CAPI (SHA256)
const hashData = (data) => {
  if (!data || typeof data !== "string") return null;
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
};

// Fire Meta CAPI Event
const fireMetaCAPIEvent = async (eventName, userData, customData) => {
  if (!PIXEL_ID || !META_ACCESS_TOKEN) {
    console.warn("Meta CAPI skipped: Missing Pixel ID or Access Token");
    return;
  }

  try {
    const hashedEmail = hashData(userData.email);
    const hashedPhone = hashData(userData.phone);
    const hashedFirstName = hashData(userData.firstName);

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: customData.event_id,
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            fn: hashedFirstName ? [hashedFirstName] : [],
            client_user_agent: userData.userAgent,
            client_ip_address: userData.ip,
          },
          custom_data: {
            value: customData.value,
            currency: "NGN",
            content_ids: [customData.productId],
            content_type: "product",
          },
        },
      ],
      test_event_code: TEST_EVENT_CODE || undefined,
    };

    console.log(`[CAPI] Webhook: Sending ${eventName} for event_id: ${customData.event_id}`);
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      payload,
    );
    console.log(`[CAPI] Webhook Success:`, response.data);
  } catch (error) {
    console.error(
      "[CAPI] Webhook Error:",
      error.response?.data || error.message,
    );
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.headers["x-paystack-signature"];

  if (!signature) {
    return res.status(400).send("No signature");
  }

  // Verify signature
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    console.error("Webhook: Invalid signature");
    return res.status(400).send("Invalid signature");
  }

  const { event, data } = req.body;

  if (event === "charge.success") {
    const { reference, metadata, amount, customer } = data;
    const productId = metadata?.product;

    console.log(`Webhook: Successful payment received for ref ${reference}`);

    // Fire Meta CAPI Purchase Event
    const firstName = metadata?.customer_name?.split(" ")[0] || customer?.first_name;
    
    await fireMetaCAPIEvent(
      "Purchase",
      {
        email: customer?.email,
        phone: metadata?.customer_phone || customer?.phone,
        firstName: firstName,
        userAgent: req.headers["user-agent"],
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      },
      {
        value: amount / 100,
        productId: productId,
        event_id: reference,
      },
    );
  }

  res.status(200).send("OK");
}
