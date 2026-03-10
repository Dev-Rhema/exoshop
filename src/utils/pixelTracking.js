const TEST_EVENT_CODE = import.meta.env.VITE_TEST_EVENT_CODE;

export const trackPageView = () => {
  if (window.fbq) {
    if (TEST_EVENT_CODE) {
      window.fbq("track", "PageView", {}, { testEventCode: TEST_EVENT_CODE });
    } else {
      window.fbq("track", "PageView");
    }
  }
};

export const trackViewContent = (productId, productTitle, price) => {
  if (window.fbq) {
    const params = {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    };
    if (TEST_EVENT_CODE) {
      window.fbq("track", "ViewContent", params, { testEventCode: TEST_EVENT_CODE });
    } else {
      window.fbq("track", "ViewContent", params);
    }
  }
};

export const trackAddToCart = (productId, productTitle, price) => {
  if (window.fbq) {
    const params = {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    };
    if (TEST_EVENT_CODE) {
      window.fbq("track", "AddToCart", params, { testEventCode: TEST_EVENT_CODE });
    } else {
      window.fbq("track", "AddToCart", params);
    }
  }
};

export const trackInitiateCheckout = (productId, productTitle, price) => {
  if (window.fbq) {
    const params = {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "NGN",
    };
    if (TEST_EVENT_CODE) {
      window.fbq("track", "InitiateCheckout", params, { testEventCode: TEST_EVENT_CODE });
    } else {
      window.fbq("track", "InitiateCheckout", params);
    }
  }
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
    if (TEST_EVENT_CODE) {
      options.testEventCode = TEST_EVENT_CODE;
    }
    window.fbq("track", "Purchase", params, options);
  }
};
