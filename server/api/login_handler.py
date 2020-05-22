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
        except:
            data = {
                "message": "Please login with your email and password"
            }
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )

        user = User.authenticate(email, password)

        if user:
            data = {
                "message": "Authenticated",
                "access_token": create_refresh_token(user.to_dict())
            }
            return Response(
                json.dumps(data),
                status=200,
                mimetype="application/json"
            )
        else:
            data = {
                "message": "Access denied."
            }
            return Response(
                json.dumps(data),
                status=401,
                mimetype="application/json"
            )
