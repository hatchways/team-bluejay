from flask_restful import Resource
from flask import jsonify, request, json
from config import STRIPE_API_KEY
from models.Order import Order, OrderJoinMealItem
from models.MealItem import MealItem
from helpers.api import custom_json_response
from flask_jwt_extended import jwt_required 

import stripe

stripe.api_key = STRIPE_API_KEY


def compute_total(ordered_items):
    total_amount = 0
    
    for item in ordered_items:
        meal_item = MealItem.get_by_id(item.get("id"))
        total_amount += ( meal_item.price * item.get("quantity") )
            
    return total_amount


class StripeResource(Resource):
    @jwt_required
    def post(self):
        try:
            data = json.loads(request.data)

            chef_id = data.get("chefId")
            user_id = data.get("userId")
            arrival_ts = data.get("arrivalDateTimeStamp")
            # items with meal_id and quantity
            ordered_items = data.get("orderedItems")

            order = Order(chef_id, user_id, arrival_ts)   
            order.save()

            for item in ordered_items:
                ojmt_obj = OrderJoinMealItem(order.id, item.get("id"), item.get("quantity"))
                ojmt_obj.save()
                
            total_amount_dollars = compute_total(ordered_items)

            intent = stripe.PaymentIntent.create(
                amount=int(total_amount_dollars*100),
                currency='usd'
            )

            return jsonify({
                'clientSecret': intent['client_secret'],
                'totalAmount': total_amount_dollars,
                'orderId': order.id
            })

        except Exception:
            return custom_json_response({'error': 'problem getting clientSecret'}, 403)