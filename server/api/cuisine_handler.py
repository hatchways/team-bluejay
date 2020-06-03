from models.Cuisine import Cuisine, CuisineSchema
from helpers.api import custom_json_response
from flask_restful import Resource

cuisines_schema = CuisineSchema(many=True)


class CuisineResource(Resource):
    def get(self):
        all_cuisines = Cuisine.query.all()
        ser_cuisines = cuisines_schema.dump(all_cuisines)
        return custom_json_response(ser_cuisines, 200)
