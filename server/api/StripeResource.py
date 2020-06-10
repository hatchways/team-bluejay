from flask_restful import Resource
from flask import jsonify, request, json
import os

import stripe
# This is your real test secret API key.
stripe.api_key = os.environ.get("STRIPE_API_KEY")

def calculate_order_amount(items=[]):
    total = 0
    for item in items:
        total += (item.quantity * item.price)
    #return value in cents
    return 100

class StripeResource(Resource):
    def post(self):
        try:
            data = json.loads(request)
            return "hi"
            total_amount = calculate_order_amount(data.get("orderedItems"))
            intent = stripe.PaymentIntent.create(
                amount=total_amount,
                currency='usd'
            )
            return"8"
            return jsonify({
                'clientSecret': intent['client_secret'],
                'totalAmount': total_amount
            })
        except Exception as e:
            return "hi"
            return jsonify(error=str(e)), 403
