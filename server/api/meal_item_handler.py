from models.MealItem import MealItem, MealItemSchema
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import jwt_optional, get_jwt_identity, jwt_required


class MealItemResource(Resource):
    def get(self):
        all_meals = MealItem.query.all()
        return json.dumps(all_meals)

    # @jwt_required
    def post(self):
        # curr_user = get_jwt_identity()
        req_body, name, description, userId = None, None, None, None
        try:
            req_body = request.get_json()
            # userId = curr_user.id
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

        try:
            userId = 1
            new_meal = MealItem(userId, name, description)
            new_meal.add_to_database()
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

