from models.User import User, UserSchema
from flask import request, Response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies, create_refresh_token, get_csrf_token, set_refresh_cookies
from helpers.api import custom_json_response
from helpers.database import save_to_database
from datetime import timedelta
from sqlalchemy import exc


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

            access_token = create_access_token(
                identity={"id": new_user.id}, expires_delta=timedelta(days=1))

            refresh_token = create_refresh_token(
                identity={"id": new_user.id}, expires_delta=timedelta(days=30))

            response = custom_json_response({
                "message": "Created", "user": user_schema.dump(new_user)}, 200)

            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response
        except exc.IntegrityError:
            return custom_json_response({"message": "User already exists!"}, 400)
        except ValueError:
            data = {
                "message":
                    "Please submit a valid password (minimum length of 6)"
            }
            return custom_json_response(data, 400)
        except Exception:
            data = {
                "message":
                    "Error in creating new user."
            }
            return custom_json_response(data, 400)
