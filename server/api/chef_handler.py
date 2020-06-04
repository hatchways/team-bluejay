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
from helpers.distance import distance
from sqlalchemy import exc

user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email', 'isChef', 'address'])


class ChefResource(Resource):
    def get(self, id=None):
        q_params = request.args
        if id:
            user = User.get_by_id(id)
            return user_schema_private.dump(user)

        filters = []
        all_chefs = User.get_all_chefs()
        ser_chefs = user_schema_private.dump(all_chefs, many=True)
        
        # stub data
        cuisines_str = "Japanese, Chinese, Mexican"
        chef_cuisines = [c.strip() for c in cuisines_str.split(",")]

        # supply maxDistance, userLat, and userLong to filter by distance
        if (q_params.get("maxDistance") and q_params.get("userLat") and q_params.get("userLon")):
            user_loc = (float(q_params.get("userLat")), float(q_params.get("userLon")))
            max_dist = float(q_params.get("maxDistance"))
            filters.append("distance")
            ser_chefs = [
                chef for chef in ser_chefs
                if chef.get("latitude") and chef.get("longitude")
                and distance((chef.get("latitude"), chef.get("longitude")), user_loc) < max_dist
            ]

        # supply userCuisines to filter by cuisines
        # user and user cuisines represented by string
        if (q_params.get("userCuisines")):
            user_cuisines = [c.strip() for c in q_params.get("userCuisines").split(",")]
            # to change user_cuisines
            filters.append("cuisine")
            ser_chefs = [
                user for user in
                ser_chefs if set(chef_cuisines)
                .intersection(user_cuisines)
            ]

        data = {
            "Search Result": ser_chefs,
            "Applied Filters": ",".join(filters)
        }
        return custom_json_response(data, 200)
