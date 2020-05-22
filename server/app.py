from flask import Flask
from marshmallow import Schema
from flask_restful import Api

from api.login_handler import LoginResource
from api.user_handler import UserResource

from api.ping_handler import ping_handler
from api.home_handler import home_handler

from flask_jwt_extended import JWTManager

from models import db


def create_app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = 'team-bluejay'
    jwt = JWTManager(app)

    app.register_blueprint(home_handler)
    app.register_blueprint(ping_handler)

    # Database variables
    user = 'postgres'
    pw = '123456'
    url = 'localhost:5432'
    db_name = 'team-bluejay'

    DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=user, pw=pw, url=url, db=db_name)

    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    api = Api(app)

    api.add_resource(UserResource, '/users')
    api.add_resource(LoginResource, '/users/login')

    return app
