from flask_restful import Resource
from flask import jsonify, request, json
from config import STRIPE_API_KEY
from models.Order import Order
from models.MealItem import MealItem

import stripe

from datetime import datetime

stripe.api_key = STRIPE_API_KEY

def total_amount_with_meal_objects(ordered_items):
    total_amount = 0
    meal_objects = []
    for item in ordered_items:
        for i in range(item.get("quantity")):
            meal_item = MealItem.get_by_id(item.get("id"))
            total_amount += meal_item.price
            meal_objects.append(meal_item)
    return {"total_amount": total_amount, "meal_objects": meal_objects}


class StripeResource(Resource):
    def post(self):
        try:
            data = json.loads(request.data)
            
            chef_id = data.get("chefId")
            user_id = data.get("userId")
            arrival_ts = data.get("arrivalDateTimeStamp")
            ordered_items = data.get("orderedItems")
            
            ret_dict = total_amount_with_meal_objects(ordered_items)
            total_amount_dollars = ret_dict.get("total_amount")
            meal_objects = ret_dict.get("meal_objects")
            
            order = Order(chef_id, user_id, arrival_ts, meal_objects)   
            order.save()

            intent = stripe.PaymentIntent.create(
                amount=int(total_amount_dollars*100),
                currency='usd'
            )
            
            return jsonify({
                'clientSecret': intent['client_secret'],
                'totalAmount': total_amount_dollars,
                'orderId': order.id
            })

        except Exception as e:
            return jsonify(error=str(e)), 403

    def get(self):
        q_params = request.args
        date = q_params.get("date")
        datetime_obj = datetime.fromtimestamp(int(int(date)/1000))
        print(datetime_obj.strftime("%m/%d/%Y, %H:%M"))
        return datetime_obj.timestamp()