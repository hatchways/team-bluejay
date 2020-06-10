import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(
  "pk_test_51GrWMVIfJQEqnwoEvjGw8NHvj3avGu7DzefFMGT7UqQo47Ev9AgQObxNKqUtPdSOS8vTkcEhJ3lmjShZwPWTjg3U00H7vjz48s"
);

console.log(stripePromise);
function AppWithStripe() {
  return (
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  );
}

ReactDOM.render(<AppWithStripe />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
