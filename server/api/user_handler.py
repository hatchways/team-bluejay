from models import db
from models.User import User, UserSchema
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import create_access_token

user_schema = UserSchema()
users_schema = UserSchema(many=True)


class UserResource(Resource):
    def get(self):
        all_users = User.query.all()
        return users_schema.dump(all_users)

    def post(self):
        req_body, name, email, password = None, None, None, None

        try:
            req_body = request.get_json()
            name = req_body['name']
            email = req_body['email']
            password = req_body['password']
        except:
            data = {
                "message": "Please submit a name, email, password (with a minimum length of 6)"
            }
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )

        try:
            new_user = User(name, email, password)
            new_user.add_to_database()
            data = {
                "message": "Created",
                "access_token": create_access_token(new_user.to_dict())
            }
            return Response(
                json.dumps(data),
                status=201,
                mimetype="application/json"
            )
        except ValueError:
            data = {
                "message":
                    "Please submit a valid password (minimum length of 6)"
            }
            return Response(
                json.dumps(data),
                status=400,
                mimetype="application/json"
            )
