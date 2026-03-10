const axios = require('axios');

async function trigger() {
  const PIXEL_ID = "1439469536842273";
  const META_ACCESS_TOKEN = "EAALal73E8JkBQztramkCk5vBrUWz7iUNhepaZBTRnG1sRJLhYxgLoy7cSEcFNeNyKLsLnZBuWa8fil0XmnRLprPpIZBO2khxc7UaCUimXMZCjQKBrY0W1a7P7djw4PDdqq4RbuJwZBBrEkzx3lLDYXTNDDlhx5l1qKZAEQREpr0TDL1eDFWP194apIbQvY8AZDZD";

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: "node_manual_trigger_" + Date.now(),
        user_data: {
          em: ["7b46d0342551ec468e815e12ec6861611794e7724eb87030836ce26589a1f349"]
        },
        custom_data: {
          value: 5000,
          currency: "NGN",
          content_name: "THE AD VAULT 2.0",
          content_type: "product"
        }
      }
    ],
    test_event_code: "TEST14501"
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      payload
    );
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

trigger();
