// Get Paystack public key from environment variables
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_PUBLIC_KEY) {
  console.error(
    "VITE_PAYSTACK_PUBLIC_KEY is not set. Please add it to your .env file.",
  );
}

/**
 * Initiates Paystack inline checkout.
 * @param {Object} product - The product object
 * @param {string} name - Customer name
 * @param {string} phone - Customer phone
 * @param {string} email - Customer email
 * @param {Function} onSuccess - Called with the full response on success
 * @param {Function} onClose - Called when modal is closed
 */
export function initiatePaystackCheckout({
  product,
  name,
  phone,
  email,
  onSuccess,
  onClose,
}) {
  if (typeof window.PaystackPop === "undefined") {
    alert("Paystack failed to load. Please refresh the page and try again.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: product.price * 100, // Paystack uses kobo
    currency: "NGN",
    ref: `DIGI_${product.id}_${Date.now()}`,
    name: "EXODIGITAL",
    description: product.title,
    image: "/productImgs/exodigital-logo.png",
    metadata: {
      product: product.id,
      product_title: product.title,
      customer_name: name,
      customer_phone: phone,
      custom_fields: [
        {
          display_name: "Product",
          variable_name: "product",
          value: product.title,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: phone,
        },
      ],
    },
    callback: function (response) {
      onSuccess(response);
    },
    onClose: function () {
      if (onClose) onClose();
    },
  });

  handler.openIframe();
}
