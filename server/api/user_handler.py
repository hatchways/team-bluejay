from models.User import User, UserSchema
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

user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email'])


class UserResource(Resource):
    def get(self):
        all_users = User.get_all()
        return user_schema_private.dump(all_users, many=True)

    def post(self):
        req_data = request.get_json()
        user_data = None
        try:
            user_data = user_schema.load(req_data)
        except Exception:
            return custom_json_response({
                "error": "Please supply a valid email and password."
            }, 400)

        if User.get_user_by_email(req_data.get("email")):
            return custom_json_response({
                "error": "User already exists. Please supply a different email."
            }, 400)

        new_user = User(**user_data)
        new_user.save()

        access_token = create_access_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=30))
        refresh_token = create_refresh_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=30))
        
        data = {
            "message": "Created",
            "user": user_schema.dump(new_user)
        }
        response = custom_json_response(data, 201)
        
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        return response
