from models.User import User, UserSchema, Cuisine
from config import MOSHES_GOOGLE_API_KEY
from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies, create_refresh_token, get_csrf_token, set_refresh_cookies, jwt_required, get_jwt_identity
from helpers.api import custom_json_response
from datetime import timedelta
from marshmallow import ValidationError
import requests


user_schema = UserSchema()
user_schema_private = UserSchema(exclude=['password', 'email'])


class UserResource(Resource):
    def get(self):
        all_users = User.query.all()
        return user_schema_private.dump(all_users, many=True)

    def post(self):
        req_body = request.get_json()
        valid_data = None
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
        # Cuisines should go into separate seeder file
        new_cuisine = Cuisine('Japanase')
        new_cuisine.save()
        new_cuisine2 = Cuisine('French')
        new_cuisine2.save()

        req_body = request.get_json()
        try:
            valid_data = user_schema.load(req_body, partial=True)
        except ValidationError as err:
            return custom_json_response(err.messages, 400)

        current_userid = get_jwt_identity()
        user = User.get_one_user(current_userid)

        geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json?'

        geocode_result = requests.get(
            geocoding_url + 'address=' + valid_data.get('streetAddress') + valid_data.get('city') + valid_data.get('state') + valid_data.get('zipcode') + valid_data.get('country') + '&key=' + MOSHES_GOOGLE_API_KEY)

        location = geocode_result.json()['results'][0]

        latitude = location['geometry']['location']['lat']
        longitude = location['geometry']['location']['lat']
        formatted_address = location['formatted_address']

        valid_data['latitude'] = float(latitude)
        valid_data['longitude'] = float(longitude)
        valid_data['formattedAddress'] = formatted_address

        user.update(valid_data)

        query = User.query.join(Cuisine, User.cuisines)
        print(query)
        favorite_cuisines = query.all()
        print(favorite_cuisines)

        ser_user = user_schema.dump(user)
        return custom_json_response(ser_user, 200)
