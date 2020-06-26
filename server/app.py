from flask import Flask, json, jsonify, request
from marshmallow import Schema
from flask_restful import Api
from config import DB_URL
from socket_events import socketio

from api.login_handler import LoginResource
from api.user_handler import UserResource
from api.chef_handler import ChefResource
from api.meal_item_handler import MealItemResource
from api.LogoutResource import LogoutResource
from api.StripeResource import StripeResource
from api.cuisine_handler import CuisineResource
from api.notification_handler import NotificationResource
from api.order_handler import OrderResource


from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity
)
from models import db


def create_app():
    app = Flask(__name__, static_folder="../client/build", static_url_path="/")

    @app.route('/')
    @app.route('/<path1>')
    @app.route('/<path1>/<path2>')
    def index(**kwargs):
        return app.send_static_file('index.html')

    return app


# if run via gunicorn this will return false
# if __name__ == "__main__":
app = create_app()
