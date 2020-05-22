from flask import request, Response, jsonify, json
from flask_restful import Resource
from models import User
from flask_jwt_extended import create_refresh_token


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
            return custom_response(data, 400)

        user = User.authenticate(email, password)

        if user:
            data = {
                "message": "Authenticated",
                "access_token": create_refresh_token({"id": user.id})
            }
            return custom_response(data, 200)
        else:
            data = {
                "message": "Access denied."
            }
            return custom_response(data, 401)


def custom_response(res, status_code):
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )
