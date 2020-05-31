from models.Chef import Chef, ChefSchema
from flask import request, Response
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
from datetime import timedelta
from sqlalchemy import exc

chef_schema = ChefSchema()
chef_schema_private = ChefSchema(exclude=['password', 'email'])


class ChefResource(Resource):
    def get(self, id=None):
        if id:
            chef = Chef.get_by_id(id)
            return chef_schema_private.dump(chef)
        all_chefs = Chef.get_all()
        return chef_schema.dump(all_chefs, many=True)