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
    app = Flask(__name__)

    app.config['JWT_TOKEN_LOCATION'] = ['cookies']

    # Only allow JWT cookies to be sent over https. In production, this
    # should likely be True
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/users/login'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_CSRF_IN_COOKIES'] = True
    app.config['JWT_SECRET_KEY'] = 'team-bluejay'
    jwt = JWTManager(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Exclude DB
    # db.init_app(app)
    api = Api(app)

    api.add_resource(UserResource, '/users')
    api.add_resource(ChefResource, '/chefs', '/chefs/<id>')
    api.add_resource(LoginResource, '/users/login')
    api.add_resource(MealItemResource, '/meal_items', '/meal_items/<id>')
    api.add_resource(LogoutResource, '/users/logout')
    api.add_resource(CuisineResource, '/cuisines')
    api.add_resource(NotificationResource, '/notifications')
    api.add_resource(StripeResource, '/create-payment-intent')
    api.add_resource(OrderResource, '/orders', '/orders/<id>')

    @app.route("/test")
    def test():
        return "Test"

    # Encrypts flask_socketio communications with a secret key
    app.config['SECRET_KEY'] = 'secret!'
    socketio.init_app(app)

    return app


if __name__ == "__main__":
    app = create_app()
    socketio.run(app)
