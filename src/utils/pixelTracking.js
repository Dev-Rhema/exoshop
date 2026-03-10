/**
 * Meta Pixel event tracking utility
 * Tracks user actions for conversion optimization and audience building
 */

export const trackPixelEvent = (eventName, data = {}) => {
  if (window.fbq) {
    window.fbq("track", eventName, data);
  }
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

// InitiateCheckout - Track when user starts payment process
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

// Lead - Track consultation/contact form submissions
export const trackLead = (productId, productTitle) => {
  trackPixelEvent("Lead", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
  });
};

// PageView - Already handled in index.html, but can be called manually if needed
export const trackPageView = () => {
  trackPixelEvent("PageView");
};

// Custom event - Add to favorites (if implemented later)
export const trackAddToFavorites = (productId, productTitle) => {
  trackPixelEvent("AddToFavorites", {
    content_name: productTitle,
    content_ids: [productId],
    content_type: "product",
  });
};
