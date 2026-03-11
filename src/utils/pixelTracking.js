// Final Production Mode - No Test Code

// Re-usable helper to send events to server for CAPI (Ensures 100% IP/UA coverage)
const sendToServerCAPI = async (eventName, params = {}, options = {}) => {
  try {
    const payload = {
      event_name: eventName,
      event_id: options.eventID || `client_${eventName}_${Date.now()}`,
      custom_data: params,
      user_data: options.userData || {}
    };
    // Non-blocking fetch so UI isn't slowed down
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(e => console.warn("CAPI Proxy error:", e));
  } catch (e) {
    // Silent fail
  }
};

export const trackPageView = () => {
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
  // REDUNDANT SERVER TRACKING
  sendToServerCAPI("PageView");
};

export const trackViewContent = (productId, productTitle, price) => {
  const params = {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  };

  if (window.fbq) {
    window.fbq("track", "ViewContent", params);
  }

  // REDUNDANT SERVER TRACKING
  sendToServerCAPI("ViewContent", params);
};

export const trackAddToCart = (productId, productTitle, price) => {
  const params = {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  };

  if (window.fbq) {
    window.fbq("track", "AddToCart", params);
  }

  // REDUNDANT SERVER TRACKING
  sendToServerCAPI("AddToCart", params);
};

export const trackInitiateCheckout = (productId, productTitle, price) => {
  const params = {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  };

  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", params);
  }

  // REDUNDANT SERVER TRACKING
  sendToServerCAPI("InitiateCheckout", params);
};

export const trackPurchase = (productId, productTitle, price, reference) => {
  if (window.fbq) {
    const params = {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
      transaction_id: reference,
    };
    const options = { eventID: reference };
    window.fbq("track", "Purchase", params, options);
  }
};
