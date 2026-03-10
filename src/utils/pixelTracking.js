/**
 * Meta Pixel Tracking Utility
 * Pixel ID: 1439469536842273
 */

export const trackPageView = () => {
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const trackViewContent = (productId, productTitle, price) => {
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    });
  }
};

export const trackAddToCart = (productId, productTitle, price) => {
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    });
  }
};

export const trackInitiateCheckout = (productId, productTitle, price) => {
  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    });
  }
};

export const trackPurchase = (productId, productTitle, price, reference) => {
  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
      transaction_id: reference,
    });
  }
};
