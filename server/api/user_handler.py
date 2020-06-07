from models.User import User, UserSchema
from flask import request
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token,
    get_csrf_token,
    set_refresh_cookies,
    jwt_required,
    get_jwt_identity,
    jwt_refresh_token_required
)
from helpers.api import custom_json_response
from helpers.google import address_to_data
from datetime import timedelta
from marshmallow import ValidationError
import os


user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email', 'address'])


class UserResource(Resource):
    @jwt_required
    def get(self):
        all_users = User.get_all()
        return user_schema_private.dump(all_users, many=True)

    def post(self):
        req_body = request.get_json()
        try:
            # load method from marshmallow validates data according to schema definition
            valid_data = user_schema.load(req_body)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        if User.get_user_by_email(req_body['email']):
            return custom_json_response({
                "error": "User already exists. Please supply a different email."
            }, 400)

        new_user = User(**valid_data)
        new_user.save()

        access_token = create_access_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=30))

        refresh_token = create_refresh_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=30))

        response_data = {
            "message": "Created",
            "user": user_schema.dump(new_user)
        }
        response = custom_json_response(response_data, 201)

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response

    @jwt_required
    def put(self):
        req_body = request.get_json()

        if req_body.get('email'):
            return custom_json_response({
                "error": "Cannot use this route to update email address."
            }, 403)

        valid_data = None
        try:
            valid_data = user_schema.load(req_body, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        current_user = get_jwt_identity()
        user = User.get_by_id(current_user.get("id"))

        user.update(valid_data)
        data = {
            "user": user_schema.dump(user),
            "message": "Succesfully Edited."
        }
        return custom_json_response(data, 200)
