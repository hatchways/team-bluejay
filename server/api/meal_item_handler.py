from models.MealItem import MealItem, MealItemSchema
from models.User import User
from flask import request, Response, json
from flask_restful import Resource
from helpers.api import custom_json_response
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required
)
from marshmallow import ValidationError
from helpers.database import save_to_database
from helpers.api import get_req_image
from helpers.image_uploads import upload_picture
meal_item_schema = MealItemSchema()


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

        req_image = get_req_image(request, 'image')
        req_data.pop('image', None)

        try:
            meal_data = meal_item_schema.load(req_data)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        new_meal = MealItem(**meal_data)
        new_meal.save()

        if req_image:
            image_url = upload_picture(
                req_image, new_meal.id, 'MealID', 'meals')

            if not image_url:
                return custom_json_response("Error with uploading image", 400)

            new_meal.update({'image': image_url})

        curr_user = User.get_by_id(user_id)
        curr_user.chef_flag_true()
        curr_user.save()

        data = {
            "message": "Created",
            "meal": meal_item_schema.dump(new_meal)
        }
        return custom_json_response(data, 201)

    @jwt_required
    def put(self, id):
        user_id = get_jwt_identity().get("id")

        meal_item = MealItem.get_by_id(id)
        if not meal_item or meal_item.userId != user_id:
            return custom_json_response(
                {"message": "You do not own that meal"}, 400)

        req_data = request.form.to_dict()
        req_image = get_req_image(request, 'image')

        if req_image:
            image_url = upload_picture(
                req_image, meal_item.id, 'MealID', 'meals')

            if not image_url:
                return custom_json_response("Error with uploading image", 400)

            req_data['image'] = image_url
        try:
            valid_data = meal_item_schema.load(req_data, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        # prevent userId from being edited
        valid_data.pop("userId", None)
        meal_item.update(valid_data)
        data = {
            "meal": meal_item_schema.dump(meal_item),
            "message": "Succesfully Edited."
        }
        return custom_json_response(data, 200)
