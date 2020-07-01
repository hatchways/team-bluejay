from flask import request, Response, json
from flask_restful import Resource
from server.models import User, UserSchema
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                set_access_cookies, create_refresh_token, set_refresh_cookies, get_csrf_token, jwt_required, jwt_refresh_token_required)
from server.helpers.api import custom_json_response
from datetime import timedelta


user_schema = UserSchema()


class LoginResource(Resource):
    @jwt_refresh_token_required
    def get(self):
        user_id = get_jwt_identity().get("id")
        curr_user = User.get_by_id(user_id)
        response = custom_json_response({
            'user': user_schema.dump(curr_user)}, 200)

        refresh_token = create_refresh_token(
            identity={"id": user_id}, expires_delta=timedelta(days=30))
        set_refresh_cookies(response, refresh_token)

        return response

    def post(self):
        req_body, email, password = None, None, None
        try:
            req_body = request.get_json()
            email = req_body['email']
            password = req_body['password']
        except Exception:
            data = {
                "message": "Please login with your email and password"
            }
            return custom_json_response(data, 400)

        user = User.authenticate(email, password)

        if user:
            access_token = create_access_token(
                identity={"id": user.id}, expires_delta=timedelta(days=30))
            refresh_token = create_refresh_token(
                identity={"id": user.id}, expires_delta=timedelta(days=30))
            response = custom_json_response({
                "message": "Authenticated", 'user': user_schema.dump(user)}, 200)

            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        else:
            data = {"message": "Incorrect username or password."}
            return custom_json_response(data, 401)
