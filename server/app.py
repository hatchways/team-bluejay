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
    #app = Flask(__name__, static_folder="../client/build", static_url_path="/")
    app = Flask(__name__)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']

    # Only allow JWT cookies to be sent over https. In production, this
    # should likely be True
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/users/login'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_CSRF_IN_COOKIES'] = True
    app.config['JWT_SECRET_KEY'] = 'team-bluejay'
    jwt = JWTManager(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    api = Api(app)

    @app.route('/')
    @app.route('/<path1>')
    @app.route('/<path1>/<path2>')
    def index(**kwargs):
        return "<h1>WELCOME HERE TO A STATIC PAGE</h1>"
        # return app.send_static_file('index.html')

    api.add_resource(UserResource, '/api/users')
    api.add_resource(ChefResource, '/api/chefs', '/api/chefs/<id>')
    api.add_resource(LoginResource, '/api/users/login')
    api.add_resource(MealItemResource, '/api/meal_items',
                     '/api/meal_items/<id>')
    api.add_resource(LogoutResource, '/api/users/logout')
    api.add_resource(CuisineResource, '/api/cuisines')
    api.add_resource(NotificationResource, '/api/notifications')
    api.add_resource(StripeResource, '/api/create-payment-intent')
    api.add_resource(OrderResource, '/api/orders', '/api/orders/<id>')

    # Encrypts flask_socketio communications with a secret key
    app.config['SECRET_KEY'] = 'secret!'
    socketio.init_app(app)

    return app


if __name__ == "__main__":
    app = create_app()
    socketio.run(app)
