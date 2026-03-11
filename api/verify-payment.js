import axios from "axios";
import crypto from "crypto";

// Meta CAPI Config
const PIXEL_ID = process.env.PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

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
    console.warn(`Meta CAPI skipped: Missing PIXEL_ID (${!!PIXEL_ID}) or META_ACCESS_TOKEN (${!!META_ACCESS_TOKEN})`);
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
    };

    console.log(`[CAPI] Sending ${eventName} for event_id: ${customData.event_id}`);
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      payload,
    );
    console.log(`[CAPI] Success:`, response.data);
  } catch (error) {
    console.error(
      "[CAPI] Error:",
      error.response?.data || error.message,
    );
  }
};

// Resend API setup
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_USER || "noreply@exodigital.com";

const mockProducts = {
  "THE_AD_VAULT_2.0": {
    title: "THE AD VAULT 2.0 150 Ready-Made Ad Templates",
    file: "/products/The_Ad_Vault_2.0.pdf",
    type: "download",
  },
  EXODIGITAL_ADVERTISING_SETUP: {
    title: "EXODIGITAL ADVERTISING SETUP",
    link: "https://wa.me/2348052998960",
    type: "link",
  },
  Print_Cash_With_SnapChat_Ads: {
    title: "Print Cash With SnapChat Ads",
    link: "https://drive.google.com/drive/folders/18995idGN9c6qmCpOMsg80BQf1c62d-I1",
    type: "link",
  },
  Top_10_States_In_Nigeria_To_Target_Rich_People: {
    title: "Top 10 States In Nigeria To Target Rich People",
    file: "/products/top-10-locations.pdf",
    type: "download",
  },
  "Master_Google_&_YouTube_Ads_in_Naira": {
    title: "Master Google & YouTube Ads in Naira",
    link: "https://drive.google.com/drive/folders/1wNuCAq0vL6mgkQh-ei0-qtwbPEcvfVYe",
    type: "link",
  },
  Clarity_Session_With_Ebuka: {
    title: "Clarity Session With Ebuka",
    link: "https://wa.me/2348052998960",
    type: "link",
  },
  Sales_Conversion_Framework_Strategy_Guide: {
    title: "Sales Conversion Framework & Strategy Guide",
    file: "/products/stop-losing-clients.pdf",
    type: "download",
  },
};

function generateEmailContent(name, productData, transaction) {
  const frontendUrl = process.env.FRONTEND_URL || "https://exodigital.com";
  let linkSection = "";

  if (!productData) {
    console.error("Product data is missing for email generation");
    linkSection = `<p style="color: #d32f2f; font-weight: bold;">Error: Product information not available</p>`;
  } else if (productData.type === "download") {
    const downloadUrl = `${frontendUrl}${productData.file}`;
    linkSection = `
      <div style="margin: 20px 0; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #4a9eff;">
        <p style="font-size: 16px; margin: 0 0 10px 0; color: #333;">
          <strong>📥 Your Access Link:</strong>
        </p>
        <a href="${downloadUrl}" style="
          display: inline-block;
          background-color: #4a9eff;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">
          Download Your Product
        </a>
      </div>
    `;
  } else if (productData.type === "link") {
    linkSection = `
      <div style="margin: 20px 0; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #4a9eff;">
        <p style="font-size: 16px; margin: 0 0 10px 0; color: #333;">
          <strong>🔗 Access Your Product:</strong>
        </p>
        <a href="${productData.link}" target="_blank" style="
          display: inline-block;
          background-color: #4a9eff;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">
          Open Link
        </a>
      </div>
    `;
  } else {
    console.warn(`Unknown product type: ${productData.type}`);
    linkSection = `<p style="color: #4a9eff;"><strong>Product Access:</strong> Your product has been delivered.</p>`;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a9eff; margin-bottom: 10px;">✅ Thank You for Your Purchase!</h1>
      
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Hi ${name},</p>
      
      <p style="color: #666;">Your payment has been successfully processed. Below is your receipt and access to your purchased product.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <h2 style="color: #333; font-size: 16px;">📋 Receipt Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Product</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${productData?.title || "Purchase"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">₦${transaction.amount.toLocaleString()}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Reference</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;"><code style="background: #fff; padding: 2px 4px;">${transaction.reference}</code></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date(transaction.timestamp).toLocaleString()}</td>
        </tr>
      </table>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      ${linkSection}
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="color: #666; font-size: 14px;">
        If you have any questions or issues accessing your product, please reply to this email or contact us at support@exodigital.com
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        &copy; 2024 EXODIGITAL. All rights reserved.
      </p>
    </div>
  `;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Forwarded-Host, X-URL-Scheme, x-api-key, Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reference, product, name, phone, email } = req.body;

    if (!reference || !product) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Debug: Check if secret key exists
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("ERROR: PAYSTACK_SECRET_KEY is not set!");
      return res
        .status(500)
        .json({
          error: "Server configuration error: Missing Paystack secret key",
        });
    }

    console.log("Verifying with reference:", reference);
    console.log("Secret key exists:", !!process.env.PAYSTACK_SECRET_KEY);

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.data.status || response.data.data.status !== "success") {
      console.error("Paystack verification failed:", response.data);
      return res
        .status(400)
        .json({ error: "Payment verification failed", details: response.data });
    }

    const transactionData = response.data.data;

    // Create transaction record
    const transaction = {
      id: transactionData.id,
      reference: transactionData.reference,
      product,
      name,
      phone,
      email,
      amount: transactionData.amount / 100,
      status: transactionData.status,
      timestamp: new Date(),
    };

    // Get product details
    const productData = mockProducts[product];

    if (!productData) {
      return res.status(400).json({ error: "Product not found" });
    }

    // Send email via Resend
    const emailContent = generateEmailContent(name, productData, transaction);

    try {
      await axios.post(
        "https://api.resend.com/emails",
        {
          from: EMAIL_FROM,
          to: email,
          subject: `Receipt & Access: ${productData.title}`,
          html: emailContent,
        },
        {
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (emailError) {
      console.error(
        "Email sending failed:",
        emailError.response?.data || emailError.message,
      );
      // Don't fail the payment verification if email fails
    }

    // Fire Meta CAPI Purchase Event
    const names = name.split(" ");
    await fireMetaCAPIEvent(
      "Purchase",
      {
        email: email,
        phone: phone,
        firstName: names[0],
        userAgent: req.headers["user-agent"],
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      },
      {
        value: transaction.amount,
        productId: product,
        event_id: reference,
      },
    );

    res.json({
      success: true,
      message: "Payment verified and receipt sent to email",
      transaction,
      product: productData,
    });
  } catch (error) {
    console.error("Verification error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
