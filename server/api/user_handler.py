from models.User import User, UserSchema
from flask import request
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token,
    get_csrf_token,
    set_refresh_cookies,
    jwt_required,
    get_jwt_identity,
    jwt_refresh_token_required
)
from helpers.api import custom_json_response
from helpers.image_uploads import upload_profile_picture
from datetime import timedelta
from marshmallow import ValidationError
import os


user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email', 'address'])


class UserResource(Resource):
    @jwt_required
    def get(self):
        all_users = User.get_all()
        return user_schema_private.dump(all_users, many=True)

    def post(self):
        req_body = request.get_json()
        try:
            # load method from marshmallow validates data according to schema definition
            valid_data = user_schema.load(req_body)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        if User.get_user_by_email(req_body['email']):
            return custom_json_response({
                "error": "User already exists. Please supply a different email."
            }, 400)

        new_user = User(**valid_data)
        new_user.save()

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
        current_userid = get_jwt_identity()
        print(current_userid)

        req_body = request.form.to_dict()
        print("PRINTING MULTIOART FORM")
        print(req_body)

        # Needed for Postman requests as Postman submits files in request.files
        if 'profileImage' in request.files:
            req_image = request.files['profileImage']
        else:
            req_image = req_body.get('profileImage')
        print("PRINTING REQ_IMAGE")
        print(req_image)
        if req_image:
            profile_image_url = upload_profile_picture(
                req_image, current_userid['id'])

            if not profile_image_url:
                return custom_json_response("Error with uploading image", 400)

            req_body['profileImage'] = profile_image_url
            print(profile_image_url)

        valid_data = None
        try:
            valid_data = user_schema.load(req_body, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        user = User.get_by_id(current_userid)

        user.update(valid_data)
        data = {
            "user": user_schema.dump(user),
            "message": "Succesfully Edited."
        }

        return custom_json_response(data, 200)
