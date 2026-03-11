// api/track-event.js
import crypto from "crypto";
import axios from "axios";

const PIXEL_ID = process.env.PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

const hashData = (data) => {
  if (!data || typeof data !== "string") return null;
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
};

export default async function handler(req, res) {
  // Allow browser to call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { event_name, event_id, user_data = {}, custom_data = {} } = req.body;

  if (!PIXEL_ID || !META_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Server Configuration Missing" });
  }

  // Get IP and User Agent from the request itself for 100% accuracy
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  try {
    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id,
        user_data: {
          em: user_data.email ? [hashData(user_data.email)] : [],
          ph: user_data.phone ? [hashData(user_data.phone)] : [],
          fn: user_data.firstName ? [hashData(user_data.firstName)] : [],
          client_user_agent: userAgent,
          client_ip_address: ip,
        },
        custom_data: {
          ...custom_data,
          currency: "NGN",
        },
      }],
    };

    await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      payload
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Tracking Proxy Error]:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send event to Meta" });
  }
}
