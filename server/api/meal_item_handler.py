from models.MealItem import MealItem, MealItemSchema
from models.User import User
from flask import request, Response, json
from flask_restful import Resource
from helpers.api import custom_json_response
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required
)
from helpers.database import save_to_database

meal_item_schema = MealItemSchema()
meal_items_schema = MealItemSchema(many=True)


class MealItemResource(Resource):
    def get(self):
        all_meals = MealItem.query.all()
        return meal_items_schema.dump(all_meals)

    # protected route
    @jwt_required
    def post(self):
        req_body, name, description = None, None, None
        try:
            req_body = request.get_json()
            name = req_body['name']
            description = req_body.get('description', "")
        except Exception:
            data = {
                "message": "Please submit a name for the meal"
            }
            return custom_json_response(data, 400)

        user_id = get_jwt_identity().get("id")
        curr_user = User.query.get(user_id)

        try:
            new_meal = MealItem(curr_user.id, name, description)
            curr_user.chef_flag_true()
            save_to_database(new_meal, curr_user)
            data = {
                "message": "Created Meal Item",
                "meal_item": meal_item_schema.dump(new_meal)
            }
            return custom_json_response(data, 201)
        except Exception:
            data = {
                "message":
                    "Meal not created."
            }
            return custom_json_response(data, 400)
