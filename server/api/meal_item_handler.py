from models.MealItem import MealItem, MealItemSchema
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity


class MealItemResource(Resource):
    def get(self):
        all_meals = MealItem.query.all()
        return json.dumps(all_meals)

    def post(self):
        curr_user = get_jwt_identity()
        return curr_user
        # curr_user = get_jwt_identity()
        # req_body, name, description= None, None, None, None
        # req_body = request.get_json()
        # return req_body['name']
        # try:
        #     req_body = request.get_json()
        #     name = req_body['name']
        #     email = req_body['email']
        #     password = req_body['password']
        # except Exception:
        #     data = {
        #         "message": "Please submit a meal name"
        #     }
        #     return Response(
        #         json.dumps(data),
        #         status=400,
        #         mimetype="application/json"
        #     )



