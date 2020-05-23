from models.MealItem import MealItem, MealItemSchema
from models.User import User
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    decode_token,
    jwt_optional
)


class MealItemResource(Resource):
    def get(self):
        all_meals = MealItem.query.all()
        return json.dumps(all_meals)

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
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )

        user_id = get_jwt_identity().get("id")
        curr_user = User.query.get(user_id)

        try:
            new_meal = MealItem(curr_user.id, name, description)
            new_meal.save_to_database()
            curr_user.chef_flag_true()
            curr_user.save_to_database()
            data = {
                "message": "Created Meal Item",
                "meal_item": new_meal.name
            }
            return Response(
                json.dumps(data),
                status=201,
                mimetype="application/json"
            )
        except Exception:
            data = {
                "message":
                    "Meal not created."
            }
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )
