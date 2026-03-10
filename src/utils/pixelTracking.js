/**
 * Meta Pixel event tracking utility
 * Tracks user actions for conversion optimization and audience building
 */

export const trackPixelEvent = (eventName, data = {}) => {
  if (window.fbq) {
    window.fbq("track", eventName, data);
  }
};

// PageView
export const trackPageView = () => {
  trackPixelEvent("PageView");
};

// ViewContent - Track when user views a product
export const trackViewContent = (productId, productTitle, price) => {
  trackPixelEvent("ViewContent", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  });
};

// AddToCart - Track when "Pay now" is clicked
export const trackAddToCart = (productId, productTitle, price) => {
  trackPixelEvent("AddToCart", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  });
};

// InitiateCheckout - Track when "Continue" in modal is clicked
export const trackInitiateCheckout = (productId, productTitle, price) => {
  trackPixelEvent("InitiateCheckout", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
  });
};

// Purchase - Track successful payment completion
export const trackPurchase = (productId, productTitle, price, reference) => {
  trackPixelEvent("Purchase", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "NGN",
    transaction_id: reference,
  });
};
