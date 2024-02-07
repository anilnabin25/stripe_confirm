// stripe.js
const options = {locale: "en"};
let stripePublishableKey = "stripePublishableKey";
let stripe = Stripe(stripePublishableKey, options);

let clientSecret = "clientSecret";
let paymentMethod = "paymentMethod";
// let paymentMethod = null;

const form = document.getElementById("payment-form");

let cardElement;
// const loadStripe = () => {
//   stripePublishableKey = document.getElementById("stripePublishableKey").value
//   stripe = Stripe(stripePublishableKey, options);
//   clientSecret = document.getElementById("clientSecret").value
//   clientSecret = document.getElementById("paymentMethod").value
// }

if (!paymentMethod) {
  // loadStripe();
  // Assuming you have an instance of Stripe Elements
  const elements = stripe.elements();
  cardElement = elements.create("card");

  // Mount the card element to your form
  cardElement.mount("#card-element");
}

// Add an event listener to your form
form.addEventListener("submit", async (event) => {
  // loadStripe();
  event.preventDefault();
  let error;
  let token;
  if (paymentMethod) {
    const error = false;
  } else {
    // Get a reference to the PaymentMethod object from the card element
    const {token: stripeToken, error: StripeError} = await stripe.createToken(
      cardElement
    );
    error = StripeError;
    token = stripeToken;
  }

  const confirmationOptions = {
    clientSecret: clientSecret,
    confirmParams: {
      return_url: "http://localhost:3001/index.html",
    },
  };
  if (paymentMethod) {
    confirmationOptions.confirmParams.payment_method = paymentMethod;
  } else {
    // Handle the case when a payment method is not available
    confirmationOptions.confirmParams.payment_method_data = {
      type: "card",
      card: {
        token: token.id,
      },
    };
  }

  if (error) {
    const messageContainer = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
  } else {
    // Token contains the PaymentMethod information, pass it when confirming the PaymentIntent
    const {error} = await stripe.confirmPayment(confirmationOptions);

    if (error) {
      const messageContainer = document.querySelector("#error-message");
      messageContainer.textContent = error.message;
    } else {
      // Handle success, e.g., redirect the user to a success page
    }
  }
});
