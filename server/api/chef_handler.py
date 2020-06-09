from models.User import User, UserSchema
from flask import request, Response, jsonify
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token,
    get_csrf_token,
    set_refresh_cookies
)
from helpers.api import custom_json_response
from helpers.database import save_to_database
from sqlalchemy import exc, or_
from helpers.distance import distance

user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email', 'isChef', 'address'])


class ChefResource(Resource):
    def get(self, id=None):
        q_params = request.args
        if id:
            user = User.get_by_id(id)
            return user_schema_private.dump(user)

        applied_filters = []
        sql_filters = []

        if q_params.get("userCuisines"):
            chosen_cuisines = q_params.get("userCuisines").split(",")
            applied_filters.append("cuisine")
            for c in chosen_cuisines:
                sql_filters.append(User.chefCuisine == c)

        chefs = User.query.filter(or_(*sql_filters)).all()
        ser_chefs = user_schema_private.dump(chefs, many=True)

        # supply maxDistance, userLat, and userLong to filter by distance
        if (q_params.get("maxDistance") and q_params.get("userLat") and q_params.get("userLon")):
            user_loc = (float(q_params.get("userLat")), float(q_params.get("userLon")))
            max_dist = float(q_params.get("maxDistance"))
            applied_filters.append("distance")
            ser_chefs = [
                chef for chef in ser_chefs
                if chef.get("latitude") and chef.get("longitude")
                and distance((chef.get("latitude"), chef.get("longitude")), user_loc) < max_dist
            ]

        data = {
            "results": ser_chefs,
            "Applied Filters": ",".join(applied_filters)
        }
        return custom_json_response(data, 200)
