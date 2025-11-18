import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Stripe price IDs - Update these with your actual Stripe Price IDs
export const STRIPE_PRICES = {
  standard: "price_standard_monthly", // Replace with your actual price ID
  professional: "price_professional_monthly", // Replace with your actual price ID
};

export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  email: string
) => {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { sessionId } = await response.json();

    const stripe = await getStripe();
    if (!stripe) throw new Error("Stripe failed to load");

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe checkout error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export const createCustomerPortalSession = async () => {
  try {
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create portal session");
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
};
