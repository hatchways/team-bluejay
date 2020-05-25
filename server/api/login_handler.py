from flask import request, Response, jsonify, json
from flask_restful import Resource
from models import User
from flask_jwt_extended import create_access_token, get_jwt_identity
from helpers.api import custom_json_response


class LoginResource(Resource):
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
            token = create_access_token(
                identity={"id": user.id}
            )
            data = {
                "message": "Authenticated",
                "access_token": token
            }
            return custom_json_response(data, 200)
        else:
            data = {
                "message": "Access denied."
            }
            return custom_json_response(data, 401)
