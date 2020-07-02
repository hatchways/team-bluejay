from server.models.MealItem import MealItem, MealItemSchema
from server.models.User import User
from flask import request, Response, json
from flask_restful import Resource
from server.helpers.api import custom_json_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError
from server.helpers.database import save_to_database
from server.helpers.image_uploads import upload_picture
meal_item_schema = MealItemSchema()
from server.controllers.meal import create_meal, edit_meal


class MealItemResource(Resource):
    def get(self, id=None):
        q_params = request.args
        if id:
            meal = MealItem.get_by_id(id)
            return meal_item_schema.dump(meal)
        if q_params.get("chefId"):
            meals = MealItem.get_meals_by_userId(q_params.get("chefId"))
            data = meal_item_schema.dump(meals, many=True)
            return custom_json_response(data, 200)
        meals = MealItem.get_all_meals()
        data = meal_item_schema.dump(meals, many=True)
        return custom_json_response(data, 200)

    @jwt_required
    def post(self):
        user_id = get_jwt_identity().get("id")

        req_data = request.form.to_dict()
        req_data["userId"] = user_id

        req_image = request.files.get('image')

        return create_meal(req_data, req_image)

    @jwt_required
    def put(self, id):
        user_id = get_jwt_identity().get("id")

        meal_item = MealItem.get_by_id(id)
        if not meal_item or meal_item.userId != user_id:
            return custom_json_response(
                {"message": "You do not own that meal"}, 400)

        meal = request.form.to_dict()
        req_image = request.files.get('image')
        return edit_meal(meal, meal_item, req_image)
