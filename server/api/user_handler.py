from models.User import User, UserSchema
from flask import request, Response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies, create_refresh_token, get_csrf_token, set_refresh_cookies, jwt_required, get_jwt_identity
from helpers.api import custom_json_response
from helpers.database import save_to_database
from datetime import timedelta
from sqlalchemy import exc
from marshmallow import ValidationError

user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email'])


class UserResource(Resource):
    def get(self):
        all_users = User.query.all()
        return user_schema_private.dump(all_users, many=True)

    def post(self):
        req_body = request.get_json()
        data = None
        try:
            # load method from marshmallow validates data according to schema definition
            data = user_schema.load(req_body)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        if User.get_user_by_email(data['email']):
            return custom_json_response({
                "error": "User already exists. Please supply a different email."
            }, 400)

        new_user = User(data)
        new_user.save()
        #new_user = User(**user_data)

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
        try:
            req_body = request.get_json()
            data = user_schema.load(req_body, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        current_userid = get_jwt_identity()
        user = User.query.get(current_userid)
        user.update(data)
        ser_user = user_schema.dump(user)
        return custom_json_response(ser_user, 200)
