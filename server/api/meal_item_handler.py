from models.MealItem import MealItem, MealItemSchema
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import create_access_token


class MealItemResource(Resource):
    def get(self):
        all_meals = MealItem.query.all()
        return json.dumps("HI")

