import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Meta CAPI Config
const PIXEL_ID = process.env.PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

// Helper to hash data for Meta CAPI (SHA256)
const hashData = (data) => {
  if (!data) return null;
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
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: customData.event_id,
          user_data: {
            em: [hashData(userData.email)],
            ph: [hashData(userData.phone)],
            fn: [hashData(userData.firstName)],
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

    await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      payload,
    );
    console.log(`Meta CAPI: ${eventName} sent successfully`);
  } catch (error) {
    console.error(
      "Meta CAPI Error:",
      error.response?.data || error.message,
    );
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Resend API setup
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_USER || "noreply@exodigital.com";

// Simple in-memory store for transactions (can be replaced with database)
const transactions = [];

// Load products from frontend
const productsPath = path.join(__dirname, "../src/data/products.js");

function getProductData(productId) {
  // This is a simplified approach - in production, keep products in a shared config
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

  return mockProducts[productId];
}

// Verify Paystack transaction
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { reference, product, name, phone, email } = req.body;

    if (!reference || !product) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify with Paystack using secret key
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.data.status || response.data.data.status !== "success") {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const transactionData = response.data.data;

    // Store transaction record
    const transaction = {
      id: transactionData.id,
      reference: transactionData.reference,
      product,
      name,
      phone,
      email,
      amount: transactionData.amount / 100, // Convert from kobo to naira
      status: transactionData.status,
      timestamp: new Date(),
    };

    transactions.push(transaction);

    // Get product details
    const productData = getProductData(product);

    // Send email via Resend
    const emailContent = generateEmailContent(
      name,
      productData,
      transaction,
      email,
    );

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
      console.log(`Email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(
        "Email sending failed:",
        emailError.response?.data || emailError.message,
      );
      // Don't fail the payment verification if email fails
      console.log(
        "Payment verified but email could not be sent. Proceeding with response.",
      );
    }

    // Fire Meta CAPI Purchase Event
    const names = name.split(" ");
    fireMetaCAPIEvent(
      "Purchase",
      {
        email: email,
        phone: phone,
        firstName: names[0],
        userAgent: req.headers["user-agent"],
        ip: req.ip,
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
});

// Generate email HTML
function generateEmailContent(name, productData, transaction, email) {
  let linkSection = "";

  if (!productData) {
    console.error("Product data is missing for email generation");
    linkSection = `<p style="color: #d32f2f; font-weight: bold;">Error: Product information not available</p>`;
  } else if (productData.type === "download") {
    const downloadUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}${productData.file}`;
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Get transaction history (for admin purposes - add authentication in production)
app.get("/api/transactions", (req, res) => {
  res.json({ transactions });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || "gmail"}`);
});
