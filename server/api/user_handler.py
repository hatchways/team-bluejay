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
users_schema = UserSchema(many=True)


class UserResource(Resource):
    def get(self):
        all_users = User.query.all()
        return users_schema.dump(all_users)

    def post(self):
        data = None
        try:
            req_body = request.get_json()
            # load method from marshmallow validates data according to schema definition
            data = user_schema.load(req_body)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        if User.query.filter_by(email=data['email']).first():
            message = {
                'error': 'User already exist, please supply another email address'}
            return custom_json_response(message, 400)

        new_user = User(data)
        save_to_database(new_user)

        access_token = create_access_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=1))

        refresh_token = create_refresh_token(
            identity={"id": new_user.id}, expires_delta=timedelta(days=30))

        response = custom_json_response({
            "message": "Created", "user": user_schema.dump(new_user)}, 200)

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response

    # Todo: how to get past csrf token using postman
    # @jwt_required
    def put(self):
        try:
            req_body = request.get_json()
            # load method from marshmallow validates data according to schema definition
            data = user_schema.load(req_body, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        #current_userid = get_jwt_identity()
        #user = User.query.get(current_userid)
        SAMPLE_ID = 1
        user = User.query.get(SAMPLE_ID)
        user.update(data)
        ser_user = user_schema.dump(user)
        return custom_json_response(ser_user, 200)
