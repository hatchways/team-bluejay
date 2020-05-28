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


class MealItemResource(Resource):
    def get(self):
        meals = MealItem.get_all_meals()
        data = meal_item_schema.dump(meals, many=True)
        return custom_json_response(data, 200)

    # protected route
    @jwt_required
    def post(self):
        req_data = request.get_json()
        user_id = get_jwt_identity().get("id")
        req_data["userId"] = user_id
        meal_data = None
        try:
            meal_data = meal_item_schema.load(req_data)
        except Exception:
            return custom_json_response({
                "error": "Please submit valid parameters to create a meal.",
                "required": "name, price, servings",
                "optional": "description, ingredients, required_stuff"
            }, 400)
        return "ok"
        new_meal = MealItem(**meal_data)
        new_meal.save()

        curr_user = User.get_one_user(user_id)
        curr_user.chef_flag_true()
        curr_user.save()

        data = {
            "message": "Created",
            "meal": meal_item_schema.dump(new_meal)
        }
        return custom_json_response(data, 201)
