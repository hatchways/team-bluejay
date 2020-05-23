from flask import request, Response, jsonify, json
from flask_restful import Resource
from models import User
from flask_jwt_extended import create_access_token, get_jwt_identity


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
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )

        user = User.authenticate(email, password)

        if user:
            token = create_refresh_token(user.to_dict())
            data = {
                "message": "Authenticated",
                "access_token": token,
                "user": get_jwt_identity()
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
