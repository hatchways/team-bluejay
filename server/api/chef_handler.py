from models.Chef import Chef, ChefSchema
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

chef_schema = ChefSchema()
chef_schema_private = ChefSchema(exclude=['password', 'email', 'isChef'])


class ChefResource(Resource):
    def get(self, id=None):
        q_params = request.args
        if id:
            chef = Chef.get_by_id(id)
            return chef_schema_private.dump(chef)

        filters = []
        all_chefs = Chef.get_all()
        ser_chefs = chef_schema_private.dump(all_chefs, many=True)

        # stub data
        chef_loc = (43.643523, -79.386722)  # CN Tower, Toronto
        cuisines_str = "Japanese, Chinese, Mexican"
        chef_cuisines = [c.strip() for c in cuisines_str.split(",")]
        # userLoc = (43.664389, -79.392249)  # Queens PArk, Toronto

        # supply maxDistance, userLat, and userLong to filter by distance
        if (q_params.get("maxDistance") and q_params.get("userLat") and q_params.get("userLon")):
            user_loc = (float(q_params.get("userLat")), float(q_params.get("userLon")))
            max_dist = float(q_params.get("maxDistance"))
            filters.append("distance")
            ser_chefs = [
                chef for chef in ser_chefs
                if distance(chef_loc, user_loc) < max_dist
            ]

        # supply userCuisines to filter by cuisines
        # user and chef cuisines represented by string
        if (q_params.get("userCuisines")):
            user_cuisines = [c.strip() for c in q_params.get("userCuisines").split(",")]
            # to change chef_cuisines
            filters.append("cuisine")
            ser_chefs = [
                chef for chef in
                ser_chefs if set(chef_cuisines)
                .intersection(user_cuisines)
            ]

        data = {
            "Search Result": ser_chefs,
            "Applied Filters": ",".join(filters)
        }
        return custom_json_response(data, 200)
