from models.User import User, UserSchema
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from helpers.api import custom_json_response
from helpers.database import save_to_database

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
        except Exception:
            data = {
                "message": "Please submit a name, email, password (with a minimum length of 6)"
            }
            return custom_json_response(data, 400)

        try:
            new_user = User(name, email, password)
            save_to_database(new_user)
            token = create_access_token(
                identity={"id": new_user.id}
            )
            data = {
                "message": "Created",
                "access_token": token
            }
            return custom_json_response(data, 201)
        except ValueError:
            data = {
                "message":
                    "Please submit a valid password (minimum length of 6)"
            }
            return custom_json_response(data, 400)
